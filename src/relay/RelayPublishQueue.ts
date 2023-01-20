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

import { RelayRecordSource } from './RelayRecordSource';
import { RelayRecordSourceMutator } from './RelayRecordSourceMutator';
import { RelayRecordSourceProxy } from './RelayRecordSourceProxy';
import { RecordSource, Store } from './RelayTypes';

/**
 * Coordinates the concurrent modification of a `Store` due to optimistic and
 * non-revertable client updates and server payloads:
 * - Applies optimistic updates.
 * - Reverts optimistic updates, rebasing any subsequent updates.
 * - Commits client updates (typically for client schema extensions).
 * - Commits server updates:
 *   - Normalizes query/mutation/subscription responses.
 *   - Executes handlers for "handle" fields.
 *   - Reverts and reapplies pending optimistic updates.
 */
export class RelayPublishQueue {
    _store: Store;
    _getDataID;
    _pendingData;

    constructor(store: Store) {
        this._pendingData = new Set();
        this._store = store;
    }

    commitSource(source: RecordSource): void {
        this._pendingData.add({ kind: 'source', source });
    }

    /**
     * Schedule an updater to mutate the store on the next `run()` typically to
     * update client schema fields.
     */
    commitUpdate(updater) {
        this._pendingData.add({
            kind: 'updater',
            updater,
        });
    }

    /**
     * Execute all queued up operations from the other public methods.
     */
    run(sourceOperation): any {
        this._commitData();
        return this._store.notify(sourceOperation, undefined);
    }

    /**
     * _commitData will return a boolean indicating if any of
     * the pending commits caused the store to be globally invalidated.
     */
    _commitData() {
        if (!this._pendingData.size) {
            return false;
        }
        this._pendingData.forEach((data) => {
            if (data.kind === 'source') {
                const source = data.source;
                this._store.publish(source);
            } else {
                const updater = data.updater;
                const sink = new RelayRecordSource();
                const mutator = new RelayRecordSourceMutator(this._store.getSource(), sink);
                const recordSourceProxy = new RelayRecordSourceProxy(mutator);
                updater(recordSourceProxy);
                this._store.publish(sink);
            }
        });
        this._pendingData.clear();
    }
}
