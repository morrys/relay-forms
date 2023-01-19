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
import { getStorageKey, RelayConcreteNode } from './RelayStoreUtils';

const { LINKED_FIELD, SCALAR_FIELD } = RelayConcreteNode;

export function mark(recordSource, selector, references): void {
    const { dataID, node } = selector;
    const marker = new RelayReferenceMarker(recordSource, references);
    marker.mark(node, dataID);
}

/**
 * @private
 */
class RelayReferenceMarker {
    _operationName;
    _recordSource;
    _references;

    constructor(recordSource, references) {
        this._operationName = null;
        this._recordSource = recordSource;
        this._references = references;
    }

    mark(node, dataID): void {
        if (node.kind === 'Operation' || node.kind === 'SplitOperation') {
            this._operationName = node.name;
        }
        this._traverse(node, dataID);
    }

    _traverse(node, dataID): void {
        this._references.add(dataID);
        const record = this._recordSource.get(dataID);
        if (record == null) {
            return;
        }
        this._traverseSelections(node.selections, record);
    }

    _traverseSelections(selections, record): void {
        selections.forEach((selection) => {
            /* eslint-disable no-fallthrough */
            switch (selection.kind) {
                case LINKED_FIELD:
                    if (selection.plural) {
                        this._traversePluralLink(selection, record);
                    } else {
                        this._traverseLink(selection, record);
                    }
                    break;
                case SCALAR_FIELD:
                    break;
                default:
                    selection as any;
            }
        });
    }

    _traverseLink(field: any, record): void {
        const storageKey = getStorageKey(field);
        const linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);

        if (linkedID == null) {
            return;
        }
        this._traverse(field, linkedID);
    }

    _traversePluralLink(field: any, record): void {
        const storageKey = getStorageKey(field);
        const linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);

        if (linkedIDs == null) {
            return;
        }
        linkedIDs.forEach((linkedID) => {
            if (linkedID != null) {
                this._traverse(field, linkedID);
            }
        });
    }
}
