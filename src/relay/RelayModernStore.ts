/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// flowlint ambiguous-object-type:error

'use strict';

import { RelayModernRecord } from './RelayModernRecord';
import { relayRead } from './RelayReader';
import { mark } from './RelayReferenceMarker';
import { RelayStoreSubscriptions } from './RelayStoreSubscriptions';
import { RelayStoreUtils } from './RelayStoreUtils';
import { MutableRecordSource, Store } from './RelayTypes';

const resolvedPromise = Promise.resolve();

/**
 * An alternative to setImmediate based on Promise.
 */
function resolveImmediate(callback: () => void) {
    resolvedPromise.then(callback).catch(throwNext);
}

function throwNext(error) {
    setTimeout(() => {
        throw error;
    }, 0);
}

const { ROOT_ID, ROOT_TYPE } = RelayStoreUtils;

/**
 * @public
 *
 * An implementation of the `Store` interface defined in `RelayStoreTypes`.
 *
 * Note that a Store takes ownership of all records provided to it: other
 * objects may continue to hold a reference to such records but may not mutate
 * them. The static Relay core is architected to avoid mutating records that may have been
 * passed to a store: operations that mutate records will either create fresh
 * records or clone existing records and modify the clones. Record immutability
 * is also enforced in development mode by freezing all records passed to a store.
 */
export class RelayModernStore implements Store {
    _gcRun;
    _gcScheduler;
    _recordSource;
    _roots;
    _storeSubscriptions;
    _updatedRecordIDs;
    _currentWriteEpoch;

    constructor(source: MutableRecordSource) {
        this._currentWriteEpoch = 0;
        this._gcRun = null;
        this._gcScheduler = resolveImmediate;
        this._recordSource = source;
        this._roots = new Map();
        this._storeSubscriptions = new RelayStoreSubscriptions();
        this._updatedRecordIDs = new Set();

        initializeRecordSource(this._recordSource);
    }

    getSource() {
        return this._recordSource;
    }

    retain(operation) {
        const id = operation.request.identifier;
        let disposed = false;
        const dispose = () => {
            // Ensure each retain can only dispose once
            if (disposed) {
                return;
            }
            disposed = true;
            // For Flow: guard against the entry somehow not existing
            const rootEntry = this._roots.get(id);
            if (rootEntry == null) {
                return;
            }
            // Decrement the ref count: if it becomes zero it is eligible
            // for release.
            rootEntry.refCount -= 1;

            if (rootEntry.refCount === 0) {
                this._roots.delete(id);
                this.scheduleGC();
            }
        };

        const rootEntry = this._roots.get(id);
        if (rootEntry != null) {
            // If we've previously retained this operation, increment the refCount
            rootEntry.refCount += 1;
        } else {
            // Otherwise create a new entry for the operation
            this._roots.set(id, {
                operation,
                refCount: 1,
            });
        }

        return { dispose };
    }

    lookup(selector) {
        const source = this.getSource();
        return relayRead(source, selector);
    }

    // This method will return a list of updated owners from the subscriptions
    notify(sourceOperation?) {
        this._currentWriteEpoch += 1;
        const source = this.getSource();
        const updatedOwners = [];
        this._storeSubscriptions.updateSubscriptions(
            source,
            this._updatedRecordIDs,
            updatedOwners,
            sourceOperation,
        );

        this._updatedRecordIDs.clear();

        return updatedOwners;
    }

    publish(source): void {
        const target = this.getSource();
        updateTargetFromSource(target, source, this._updatedRecordIDs);
    }

    subscribe(snapshot, callback: (snapshot) => void) {
        return this._storeSubscriptions.subscribe(snapshot, callback);
    }

    // Internal API
    __getUpdatedRecordIDs() {
        return this._updatedRecordIDs;
    }

    scheduleGC() {
        if (this._gcRun) {
            return;
        }
        this._gcRun = this._collect();
        this._gcScheduler(this._gcStep);
    }

    /**
     * Run a full GC synchronously.
     */
    __gc(): void {
        const gcRun = this._collect();
        while (!gcRun.next().done) {}
    }

    _gcStep = (): void => {
        if (this._gcRun) {
            if (this._gcRun.next().done) {
                this._gcRun = null;
            } else {
                this._gcScheduler(this._gcStep);
            }
        }
    };

    *_collect(): Generator<void, void, void> {
        /* eslint-disable no-labels */
        top: while (true) {
            const startEpoch = this._currentWriteEpoch;
            const references = new Set();

            // Mark all records that are traversable from a root
            for (const { operation } of this._roots.values()) {
                const selector = operation.root;
                mark(this._recordSource, selector, references);
                // Yield for other work after each operation
                yield;

                // If the store was updated, restart
                if (startEpoch !== this._currentWriteEpoch) {
                    continue top;
                }
            }

            // Sweep records without references
            if (references.size === 0) {
                // Short-circuit if *nothing* is referenced
                this._recordSource.clear();
            } else {
                // Evict any unreferenced nodes
                const storeIDs = this._recordSource.getRecordIDs();
                for (let ii = 0; ii < storeIDs.length; ii++) {
                    const dataID = storeIDs[ii];
                    if (!references.has(dataID)) {
                        this._recordSource.remove(dataID);
                    }
                }
            }
            return;
        }
    }
}

function initializeRecordSource(target) {
    if (!target.has(ROOT_ID)) {
        const rootRecord = RelayModernRecord.create(ROOT_ID, ROOT_TYPE);
        target.set(ROOT_ID, rootRecord);
    }
}

/**
 * Updates the target with information from source, also updating a mapping of
 * which records in the target were changed as a result.
 * Additionally, will mark records as invalidated at the current write epoch
 * given the set of record ids marked as stale in this update.
 */
function updateTargetFromSource(target, source, updatedRecordIDs): void {
    // Update the target based on the changes present in source
    const dataIDs = source.getRecordIDs();
    for (let ii = 0; ii < dataIDs.length; ii++) {
        const dataID = dataIDs[ii];
        const sourceRecord = source.get(dataID);
        const targetRecord = target.get(dataID);
        if (sourceRecord && targetRecord) {
            // ReactFlightClientResponses are lazy and only materialize when readRoot
            // is called when we read the field, so if the record is a Flight field
            // we always use the new record's data regardless of whether
            // it actually changed. Let React take care of reconciliation instead.
            const nextRecord = RelayModernRecord.update(targetRecord, sourceRecord);
            if (nextRecord !== targetRecord) {
                updatedRecordIDs.add(dataID);
                target.set(dataID, nextRecord);
            }
        } else if (sourceRecord === null) {
            target.delete(dataID);
            if (targetRecord !== null) {
                updatedRecordIDs.add(dataID);
            }
        } else if (sourceRecord) {
            target.set(dataID, sourceRecord);
            updatedRecordIDs.add(dataID);
        } // don't add explicit undefined
    }
}
