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

export function mark(recordSource, selector, references): void {
    const { dataID, node } = selector;
    const marker = new RelayReferenceMarker(recordSource, references);
    marker.mark(node, dataID);
}

/**
 * @private
 */
class RelayReferenceMarker {
    _recordSource;
    _references;

    constructor(recordSource, references) {
        this._recordSource = recordSource;
        this._references = references;
    }

    mark(node, dataID): void {
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
            if (selection.kind == LINKED_FIELD) {
                if (selection.plural) {
                    this._traversePluralLink(selection, record);
                } else {
                    this._traverseLink(selection, record);
                }
            }
        });
    }

    _traverseLink(field: any, record): void {
        const linkedID = RelayModernRecord.getLinkedRecordID(record, field.name);

        if (linkedID == null) {
            return;
        }
        this._traverse(field, linkedID);
    }

    _traversePluralLink(field: any, record): void {
        const linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, field.name);

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
