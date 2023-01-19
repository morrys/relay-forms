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

import { generateClientID, getStableStorageKey } from './RelayStoreUtils';
import { RecordProxy } from './RelayTypes';

/**
 * @internal
 *
 * A helper class for manipulating a given record from a record source via an
 * imperative/OO-style API.
 */
export class RelayRecordProxy implements RecordProxy {
    _dataID;
    _mutator;
    _source;

    constructor(source, mutator, dataID) {
        this._dataID = dataID;
        this._mutator = mutator;
        this._source = source;
    }

    copyFieldsFrom(source: RecordProxy): void {
        this._mutator.copyFields(source.getDataID(), this._dataID);
    }

    getDataID(): string {
        return this._dataID;
    }

    getType(): string {
        return this._mutator.getType(this._dataID);
    }

    getValue(name: string) {
        const storageKey = getStableStorageKey(name);
        return this._mutator.getValue(this._dataID, storageKey);
    }

    setValue(value, name: string) {
        const storageKey = getStableStorageKey(name);
        this._mutator.setValue(this._dataID, storageKey, value);
        return this;
    }

    getLinkedRecord(name: string) {
        const storageKey = getStableStorageKey(name);
        const linkedID = this._mutator.getLinkedRecordID(this._dataID, storageKey);
        return linkedID != null ? this._source.get(linkedID) : linkedID;
    }

    setLinkedRecord(record: RecordProxy, name: string) {
        const storageKey = getStableStorageKey(name);
        const linkedID = record.getDataID();
        this._mutator.setLinkedRecordID(this._dataID, storageKey, linkedID);
        return this;
    }

    getOrCreateLinkedRecord(name: string, typeName: string) {
        let linkedRecord = this.getLinkedRecord(name);
        if (!linkedRecord) {
            const storageKey = getStableStorageKey(name);
            const clientID = generateClientID(this.getDataID(), storageKey);
            // NOTE: it's possible that a client record for this field exists
            // but the field itself was unset.
            linkedRecord = this._source.get(clientID) ?? this._source.create(clientID, typeName);
            this.setLinkedRecord(linkedRecord, name);
        }
        return linkedRecord;
    }

    getLinkedRecords(name: string): Array<RecordProxy | null | undefined> | null | undefined {
        const storageKey = getStableStorageKey(name);
        const linkedIDs = this._mutator.getLinkedRecordIDs(this._dataID, storageKey);
        if (linkedIDs == null) {
            return linkedIDs;
        }
        return linkedIDs.map((linkedID) => {
            return linkedID != null ? this._source.get(linkedID) : linkedID;
        });
    }

    setLinkedRecords(records, name: string): RecordProxy {
        const storageKey = getStableStorageKey(name);
        const linkedIDs = records.map((record) => record && record.getDataID());
        this._mutator.setLinkedRecordIDs(this._dataID, storageKey, linkedIDs);
        return this;
    }
}
