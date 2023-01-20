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
import { RelayConcreteNode } from './RelayStoreUtils';

const { LINKED_FIELD } = RelayConcreteNode;

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
        const record = this._recordSource.get(dataID);
        this._seenRecords.add(dataID);
        if (record == null) {
            return record;
        }
        const data = prevData || {};
        const hadRequiredData = this._traverseSelections(node.selections, record, data);
        return hadRequiredData ? data : null;
    }

    _traverseSelections(selections, record, data): boolean /* had all expected data */ {
        for (let i = 0; i < selections.length; i++) {
            const selection = selections[i];
            if (selection.kind == LINKED_FIELD) {
                if (selection.plural) {
                    this._readPluralLink(selection, record, data);
                } else {
                    this._readLink(selection, record, data);
                }
            } else {
                // relay-forms now default scalar
                this._readScalar(selection, record, data);
            }
        }
        return true;
    }

    _readScalar(field, record, data): any {
        const name = field.name;
        const value = RelayModernRecord.getValue(record, name);
        data[name] = value;
        return value;
    }

    _readLink(field, record, data): any {
        const name = field.name;
        const linkedID = RelayModernRecord.getLinkedRecordID(record, name);
        if (linkedID == null) {
            data[name] = linkedID;
            return linkedID;
        }

        const prevData = data[name];
        const value = this._traverse(field, linkedID, prevData);
        data[name] = value;
        return value;
    }

    _readPluralLink(field, record, data): any {
        const name = field.name;
        const linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, name);

        if (linkedIDs == null) {
            data[name] = linkedIDs;
            return linkedIDs;
        }

        const prevData = data[name];
        const linkedArray = prevData || [];
        linkedIDs.forEach((linkedID, nextIndex) => {
            if (linkedID == null) {
                linkedArray[nextIndex] = linkedID;
                return;
            }
            const prevItem = linkedArray[nextIndex];
            linkedArray[nextIndex] = this._traverse(field, linkedID, prevItem);
        });
        data[name] = linkedArray;
        return linkedArray;
    }
}
