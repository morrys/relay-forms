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
import { LINKED_FIELD } from './RelayStoreUtils';

export function relayRead(recordSource, selector) {
    const reader = new RelayReader(recordSource, selector);
    return reader.read();
}

/**
 * @private
 */
class RelayReader {
    _recordSource;
    _seenRecords;
    _selector;

    constructor(recordSource, selector) {
        this._recordSource = recordSource;
        this._seenRecords = new Set();
        this._selector = selector;
    }

    read() {
        const { node, dataID } = this._selector;
        const data = this._traverse(node, dataID, null);
        return {
            data,
            seenRecords: this._seenRecords,
            selector: this._selector,
        };
    }

    _traverse(node, dataID, prevData) {
        if (dataID == null) {
            return dataID;
        }
        const record = this._recordSource.get(dataID);
        this._seenRecords.add(dataID);
        if (record == null) {
            return record;
        }
        const data = prevData || {};
        this._traverseSelections(node.selections, record, data);
        return data;
    }

    _traverseSelections(selections, record, data) /* had all expected data */ {
        for (let i = 0; i < selections.length; i++) {
            const selection = selections[i];
            const name = selection.name;
            const prevData = data[name];
            let value = null;
            if (selection.kind == LINKED_FIELD) {
                if (selection.plural) {
                    const ids = RelayModernRecord.getLinkedRecordIDs(record, name);
                    if (ids != null) {
                        const linkedArray = prevData || [];
                        ids.forEach((linkedID, nextIndex) => {
                            const prevItem = linkedArray[nextIndex];
                            linkedArray[nextIndex] = this._traverse(selection, linkedID, prevItem);
                        });
                        value = linkedArray;
                    }
                } else {
                    const id = RelayModernRecord.getLinkedRecordID(record, name);
                    value = this._traverse(selection, id, prevData);
                }
            } else {
                // relay-forms, now default scalar
                value = RelayModernRecord.getValue(record, name);
                //this._readScalar(selection, record, data);
            }
            data[name] = value;
        }
    }
}
