/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import { RelayRecordState } from './RelayStoreUtils';
import { MutableRecordSource, Record, RecordState } from './RelayTypes';

const { EXISTENT, NONEXISTENT, UNKNOWN } = RelayRecordState;

/**
 * An implementation of the `MutableRecordSource` interface (defined in
 * `RelayStoreTypes`) that holds all records in memory (JS Map).
 */
export class RelayRecordSourceMapImpl implements MutableRecordSource {
    _records;

    constructor(records?) {
        this._records = new Map();
        if (records != null) {
            Object.keys(records).forEach((key) => {
                this._records.set(key, records[key]);
            });
        }
    }

    clear(): void {
        this._records = new Map();
    }

    delete(dataID): void {
        this._records.set(dataID, null);
    }

    get(dataID): Record | null | undefined {
        return this._records.get(dataID);
    }

    getRecordIDs(): Array<string> {
        return Array.from(this._records.keys());
    }

    getStatus(dataID): RecordState {
        if (!this._records.has(dataID)) {
            return UNKNOWN;
        }
        return this._records.get(dataID) == null ? NONEXISTENT : EXISTENT;
    }

    has(dataID): boolean {
        return this._records.has(dataID);
    }

    remove(dataID): void {
        this._records.delete(dataID);
    }

    set(dataID, record): void {
        this._records.set(dataID, record);
    }

    size(): number {
        return this._records.size;
    }

    toJSON(): any {
        const obj = {};
        for (const [key, value] of this._records.entries()) {
            obj[key] = value;
        }
        return obj;
    }
}
