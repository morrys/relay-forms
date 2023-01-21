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
        if (dataID != null) {
            this._references.add(dataID);
            const record = this._recordSource.get(dataID);
            record != null && this._traverseSelections(node.selections, record);
        }
    }

    _traverseSelections(selections, record): void {
        selections.forEach((selection) => {
            const name = selection.name;
            if (selection.kind == LINKED_FIELD) {
                if (selection.plural) {
                    const linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, name) || [];
                    linkedIDs.forEach((linkedID) => {
                        this._traverse(selection, linkedID);
                    });
                } else {
                    const linkedID = RelayModernRecord.getLinkedRecordID(record, name);
                    this._traverse(selection, linkedID);
                }
            }
        });
    }
}
