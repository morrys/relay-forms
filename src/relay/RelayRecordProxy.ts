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

import { RelayRecordSourceMutator } from './RelayRecordSourceMutator';
import { RecordProxy } from './RelayTypes';

/**
 * @internal
 *
 * A helper class for manipulating a given record from a record source via an
 * imperative/OO-style API.
 */
export class RelayRecordProxy implements RecordProxy {
    _dataID;
    _mutator: RelayRecordSourceMutator;
    _source;

    constructor(source, mutator, dataID) {
        this._dataID = dataID;
        this._mutator = mutator;
        this._source = source;
    }

    getDataID(): string {
        return this._dataID;
    }

    setValue(value, name: string) {
        this._mutator.setValue(this._dataID, name, value);
        return this;
    }

    setLinkedRecord(record: RecordProxy, name: string) {
        const linkedID = record.getDataID();
        this._mutator.setLinkedRecordID(this._dataID, name, linkedID);
        return this;
    }

    getLinkedRecords(name: string): Array<RecordProxy | null | undefined> | null | undefined {
        const linkedIDs = this._mutator.getLinkedRecordIDs(this._dataID, name);
        if (linkedIDs == null) {
            return linkedIDs;
        }
        return linkedIDs.map((linkedID) => {
            return linkedID != null ? this._source.get(linkedID) : linkedID;
        });
    }

    setLinkedRecords(records, name: string): RecordProxy {
        const linkedIDs = records.map((record) => record && record.getDataID());
        this._mutator.setLinkedRecordIDs(this._dataID, name, linkedIDs);
        return this;
    }
}
