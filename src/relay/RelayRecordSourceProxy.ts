/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import { RelayRecordProxy } from './RelayRecordProxy';
import { RelayStoreUtils, RelayRecordState } from './RelayStoreUtils';
import { RecordSourceProxy } from './RelayTypes';

/**
 * @internal
 *
 * A helper for manipulating a `RecordSource` via an imperative/OO-style API.
 */
export class RelayRecordSourceProxy implements RecordSourceProxy {
    __mutator;
    _proxies;

    constructor(mutator) {
        this.__mutator = mutator;
        this._proxies = {};
    }

    create(dataID, typeName) {
        this.__mutator.create(dataID, typeName);
        delete this._proxies[dataID];
        return this.get(dataID);
    }

    delete(dataID) {
        delete this._proxies[dataID];
        this.__mutator.delete(dataID);
    }

    get(dataID) {
        if (!this._proxies.hasOwnProperty(dataID)) {
            const status = this.__mutator.getStatus(dataID);
            if (status === RelayRecordState.EXISTENT) {
                this._proxies[dataID] = new RelayRecordProxy(this, this.__mutator, dataID);
            } else {
                this._proxies[dataID] = status === RelayRecordState.NONEXISTENT ? null : undefined;
            }
        }
        return this._proxies[dataID];
    }

    getRoot() {
        let root = this.get(RelayStoreUtils.ROOT_ID);
        if (!root) {
            root = this.create(RelayStoreUtils.ROOT_ID, RelayStoreUtils.ROOT_TYPE);
        }
        return root;
    }
}
