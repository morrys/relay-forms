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
import { RelayRecordSource } from './RelayRecordSource';
import { RelayRecordSourceMutator } from './RelayRecordSourceMutator';
import { RelayRecordSourceProxy } from './RelayRecordSourceProxy';
import { mark } from './RelayReferenceMarker';
import { hasOverlappingIDs, recycleNodesInto, RelayStoreUtils } from './RelayStoreUtils';
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

const { ROOT_ID } = RelayStoreUtils;

export function createStore() {
    return new RelayModernStore(new RelayRecordSource());
}

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
    _recordSource: MutableRecordSource;
    _roots;
    _updatedRecordIDs;
    _currentWriteEpoch;
    _subs;

    constructor(source: MutableRecordSource) {
        this._currentWriteEpoch = 0;
        this._gcRun = null;
        this._recordSource = source;
        this._roots = new Map();
        this._updatedRecordIDs = new Set();
        this._subs = new Set();

        initializeRecordSource(this._recordSource);
    }

    getSource() {
        return this._recordSource;
    }

    commitUpdate(updater): void {
        const sink = new RelayRecordSource();
        const mutator = new RelayRecordSourceMutator(this.getSource(), sink);
        const recordSourceProxy = new RelayRecordSourceProxy(mutator);
        updater(recordSourceProxy);
        this.publish(sink);
        this.notify();
    }

    retain(operation) {
        const id = operation.identifier;
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
    notify() {
        this._currentWriteEpoch += 1;
        const updateIds = this._updatedRecordIDs;
        const hasUpdatedRecords = updateIds.size !== 0;
        const source = this.getSource();
        this._subs.forEach((subscription) => {
            this._updateSub(source, subscription, updateIds, hasUpdatedRecords);
        });
        this._updatedRecordIDs.clear();
    }

    _updateSub(source, subscription, updatedRecordIDs, hasUpdatedRecords: boolean) {
        const { callback, snapshot } = subscription;
        const hasOverlappingUpdates =
            hasUpdatedRecords && hasOverlappingIDs(snapshot.seenRecords, updatedRecordIDs);
        if (hasOverlappingUpdates) {
            let nextSnapshot = relayRead(source, snapshot.selector);
            const nextData = recycleNodesInto(snapshot.data, nextSnapshot.data);
            nextSnapshot = {
                data: nextData,
                seenRecords: nextSnapshot.seenRecords,
                selector: nextSnapshot.selector,
            };
            subscription.snapshot = nextSnapshot;
            if (nextSnapshot.data !== snapshot.data) {
                callback(nextSnapshot);
            }
        }
    }

    publish(source): void {
        const target = this.getSource();
        updateTargetFromSource(target, source, this._updatedRecordIDs);
    }

    subscribe(snapshot, callback: (snapshot) => void) {
        const subscription = { callback, snapshot };
        const dispose = () => {
            this._subs.delete(subscription);
        };
        this._subs.add(subscription);
        return { dispose };
    }

    scheduleGC() {
        if (this._gcRun) {
            return;
        }
        this._gcRun = this._collect();
        resolveImmediate(this._gcStep);
    }

    _gcStep = (): void => {
        if (this._gcRun) {
            if (this._gcRun.next().done) {
                this._gcRun = null;
            } else {
                resolveImmediate(this._gcStep);
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
                mark(this._recordSource, operation.fragment, references);
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
        const rootRecord = RelayModernRecord.create(ROOT_ID);
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
