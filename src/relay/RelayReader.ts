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
import { getStorageKey, RelayConcreteNode, RelayStoreUtils } from './RelayStoreUtils';

// flowlint ambiguous-object-type:error

const { LINKED_FIELD, SCALAR_FIELD } = RelayConcreteNode;
const { ROOT_ID } = RelayStoreUtils;

export function relayRead(recordSource, selector) {
    const reader = new RelayReader(recordSource, selector);
    return reader.read();
}

/**
 * @private
 */
class RelayReader {
    _isMissingData: boolean;
    _isWithinUnmatchedTypeRefinement: boolean;
    _missingRequiredFields;
    _owner;
    _recordSource;
    _seenRecords;
    _selector;

    constructor(recordSource, selector) {
        this._isMissingData = false;
        this._isWithinUnmatchedTypeRefinement = false;
        this._missingRequiredFields = null;
        this._owner = selector.owner;
        this._recordSource = recordSource;
        this._seenRecords = new Set();
        this._selector = selector;
    }

    read() {
        const { node, dataID, isWithinUnmatchedTypeRefinement } = this._selector;
        const { abstractKey } = node;
        const record = this._recordSource.get(dataID);

        // Relay historically allowed child fragments to be read even if the root object
        // did not match the type of the fragment: either the root object has a different
        // concrete type than the fragment (for concrete fragments) or the root object does
        // not conform to the interface/union for abstract fragments.
        // For suspense purposes, however, we want to accurately compute whether any data
        // is missing: but if the fragment type doesn't match (or a parent type didn't
        // match), then no data is expected to be present.

        // By default data is expected to be present unless this selector was read out
        // from within a non-matching type refinement in a parent fragment:
        let isDataExpectedToBePresent = !isWithinUnmatchedTypeRefinement;

        // If this is a concrete fragment and the concrete type of the record does not
        // match, then no data is expected to be present.
        if (isDataExpectedToBePresent && abstractKey == null && record != null) {
            const recordType = RelayModernRecord.getType(record);
            if (recordType !== node.type && dataID !== ROOT_ID) {
                isDataExpectedToBePresent = false;
            }
        }

        this._isWithinUnmatchedTypeRefinement = !isDataExpectedToBePresent;
        const data = this._traverse(node, dataID, null);
        return {
            data,
            isMissingData: this._isMissingData && isDataExpectedToBePresent,
            seenRecords: this._seenRecords,
            selector: this._selector,
            missingRequiredFields: this._missingRequiredFields,
        };
    }

    _traverse(node, dataID, prevData) {
        const record = this._recordSource.get(dataID);
        this._seenRecords.add(dataID);
        if (record == null) {
            if (record === undefined) {
                this._isMissingData = true;
            }
            return record;
        }
        const data = prevData || {};
        const hadRequiredData = this._traverseSelections(node.selections, record, data);
        return hadRequiredData ? data : null;
    }

    _traverseSelections(selections, record, data): boolean /* had all expected data */ {
        for (let i = 0; i < selections.length; i++) {
            const selection = selections[i];
            switch (selection.kind) {
                case SCALAR_FIELD:
                    this._readScalar(selection, record, data);
                    break;
                case LINKED_FIELD:
                    if (selection.plural) {
                        this._readPluralLink(selection, record, data);
                    } else {
                        this._readLink(selection, record, data);
                    }
                    break;
                default:
                    selection as any;
            }
        }
        return true;
    }

    _readScalar(field, record, data): any {
        const applicationName = field.alias ?? field.name;
        const storageKey = getStorageKey(field);
        const value = RelayModernRecord.getValue(record, storageKey);
        if (value === undefined) {
            this._isMissingData = true;
        }
        data[applicationName] = value;
        return value;
    }

    _readLink(field, record, data): any {
        const applicationName = field.alias ?? field.name;
        const storageKey = getStorageKey(field);
        const linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
        if (linkedID == null) {
            data[applicationName] = linkedID;
            if (linkedID === undefined) {
                this._isMissingData = true;
            }
            return linkedID;
        }

        const prevData = data[applicationName];
        const value = this._traverse(field, linkedID, prevData);
        data[applicationName] = value;
        return value;
    }

    _readPluralLink(field, record, data): any {
        const applicationName = field.alias ?? field.name;
        const storageKey = getStorageKey(field);
        const linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);

        if (linkedIDs == null) {
            data[applicationName] = linkedIDs;
            if (linkedIDs === undefined) {
                this._isMissingData = true;
            }
            return linkedIDs;
        }

        const prevData = data[applicationName];
        const linkedArray = prevData || [];
        linkedIDs.forEach((linkedID, nextIndex) => {
            if (linkedID == null) {
                if (linkedID === undefined) {
                    this._isMissingData = true;
                }
                // $FlowFixMe[cannot-write]
                linkedArray[nextIndex] = linkedID;
                return;
            }
            const prevItem = linkedArray[nextIndex];
            linkedArray[nextIndex] = this._traverse(field, linkedID, prevItem);
        });
        data[applicationName] = linkedArray;
        return linkedArray;
    }
}
