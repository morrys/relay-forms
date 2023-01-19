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

import { RelayModernRecord } from './RelayModernRecord';

/**
 * @internal
 *
 * Wrapper API that is an amalgam of the `RelayModernRecord` API and
 * `MutableRecordSource` interface, implementing copy-on-write semantics for records
 * in a record source.
 *
 * Modifications are applied to fresh copies of records:
 * - Records in `base` are never modified.
 * - Modifications cause a fresh version of a record to be created in `sink`.
 *   These sink records contain only modified fields.
 */
export class RelayRecordSourceMutator {
    __sources;
    _base;
    _sink;

    constructor(base, sink) {
        this.__sources = [sink, base];
        this._base = base;
        this._sink = sink;
    }

    _getSinkRecord(dataID): typeof RelayModernRecord {
        let sinkRecord = this._sink.get(dataID);
        if (!sinkRecord) {
            const baseRecord = this._base.get(dataID);
            sinkRecord = RelayModernRecord.create(dataID, RelayModernRecord.getType(baseRecord));
            this._sink.set(dataID, sinkRecord);
        }
        return sinkRecord;
    }

    copyFields(sourceID, sinkID): void {
        const sinkSource = this._sink.get(sourceID);
        const baseSource = this._base.get(sourceID);
        const sink = this._getSinkRecord(sinkID);
        if (baseSource) {
            RelayModernRecord.copyFields(baseSource, sink);
        }
        if (sinkSource) {
            RelayModernRecord.copyFields(sinkSource, sink);
        }
    }

    create(dataID, typeName): void {
        const record = RelayModernRecord.create(dataID, typeName);
        this._sink.set(dataID, record);
    }

    delete(dataID): void {
        this._sink.delete(dataID);
    }

    getStatus(dataID) {
        return this._sink.has(dataID) ? this._sink.getStatus(dataID) : this._base.getStatus(dataID);
    }

    getType(dataID) {
        for (let ii = 0; ii < this.__sources.length; ii++) {
            const record = this.__sources[ii].get(dataID);
            if (record) {
                return RelayModernRecord.getType(record);
            } else if (record === null) {
                return null;
            }
        }
    }

    getValue(dataID, storageKey: string) {
        for (let ii = 0; ii < this.__sources.length; ii++) {
            const record = this.__sources[ii].get(dataID);
            if (record) {
                const value = RelayModernRecord.getValue(record, storageKey);
                if (value !== undefined) {
                    return value;
                }
            } else if (record === null) {
                return null;
            }
        }
    }

    setValue(dataID, storageKey: string, value): void {
        const sinkRecord = this._getSinkRecord(dataID);
        RelayModernRecord.setValue(sinkRecord, storageKey, value);
    }

    getLinkedRecordID(dataID, storageKey: string) {
        for (let ii = 0; ii < this.__sources.length; ii++) {
            const record = this.__sources[ii].get(dataID);
            if (record) {
                const linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
                if (linkedID !== undefined) {
                    return linkedID;
                }
            } else if (record === null) {
                return null;
            }
        }
    }

    setLinkedRecordID(dataID, storageKey, linkedID) {
        const sinkRecord = this._getSinkRecord(dataID);
        RelayModernRecord.setLinkedRecordID(sinkRecord, storageKey, linkedID);
    }

    getLinkedRecordIDs(dataID, storageKey: string) {
        for (let ii = 0; ii < this.__sources.length; ii++) {
            const record = this.__sources[ii].get(dataID);
            if (record) {
                const linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);
                if (linkedIDs !== undefined) {
                    return linkedIDs;
                }
            } else if (record === null) {
                return null;
            }
        }
    }

    setLinkedRecordIDs(dataID, storageKey: string, linkedIDs): void {
        const sinkRecord = this._getSinkRecord(dataID);
        RelayModernRecord.setLinkedRecordIDs(sinkRecord, storageKey, linkedIDs);
    }
}
