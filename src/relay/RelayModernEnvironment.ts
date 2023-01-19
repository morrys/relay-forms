/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @emails oncall+relay
 * @format
 */

// flowlint ambiguous-object-type:error

'use strict';

import { RelayModernStore } from './RelayModernStore';
import { RelayPublishQueue } from './RelayPublishQueue';
import { RelayRecordSource } from './RelayRecordSource';
import { IEnvironment, Store } from './RelayTypes';
/*
const VIEWER_ID = generateClientID(RelayStoreUtils.ROOT_ID, 'viewer');
const VIEWER_TYPE = 'Viewer';

function defaultGetDataID(fieldValue, typeName): any {
    if (typeName === VIEWER_TYPE) {
        // $FlowFixMe[prop-missing]
        return fieldValue.id == null ? VIEWER_ID : fieldValue.id;
    }
    // $FlowFixMe[prop-missing]
    return fieldValue.id;
}*/

export function createEnvironment() {
    return new RelayModernEnvironment(new RelayModernStore(new RelayRecordSource()));
}

export class RelayModernEnvironment implements IEnvironment {
    _publishQueue;
    _store;

    constructor(store: Store) {
        this._publishQueue = new RelayPublishQueue(store);
        this._store = store;
    }

    getStore() {
        return this._store;
    }

    commitUpdate(updater): void {
        this._publishQueue.commitUpdate(updater);
        this._publishQueue.run();
    }

    lookup(readSelector) {
        return this._store.lookup(readSelector);
    }

    subscribe(snapshot, callback: (snapshot) => void) {
        return this._store.subscribe(snapshot, callback);
    }

    retain(operation) {
        return this._store.retain(operation);
    }
}
