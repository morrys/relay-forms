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
import { cloneRelayHandleSourceField, getStorageKey, RelayConcreteNode } from './RelayStoreUtils';

const {
    CONDITION,
    CLIENT_COMPONENT,
    CLIENT_EXTENSION,
    DEFER,
    INLINE_FRAGMENT,
    LINKED_FIELD,
    MODULE_IMPORT,
    LINKED_HANDLE,
    SCALAR_FIELD,
    SCALAR_HANDLE,
    STREAM,
    TYPE_DISCRIMINATOR,
} = RelayConcreteNode;

export function mark(recordSource, selector, references): void {
    const { dataID, node, variables } = selector;
    const marker = new RelayReferenceMarker(recordSource, variables, references);
    marker.mark(node, dataID);
}

/**
 * @private
 */
class RelayReferenceMarker {
    _operationName;
    _recordSource;
    _references;
    _variables;

    constructor(recordSource, variables, references) {
        this._operationName = null;
        this._recordSource = recordSource;
        this._references = references;
        this._variables = variables;
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

    _getVariableValue(name: string): any {
        // $FlowFixMe[cannot-write]
        return this._variables[name];
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
                case CONDITION:
                    const conditionValue = Boolean(this._getVariableValue(selection.condition));
                    if (conditionValue === selection.passingValue) {
                        this._traverseSelections(selection.selections, record);
                    }
                    break;
                case INLINE_FRAGMENT:
                    if (selection.abstractKey == null) {
                        const typeName = RelayModernRecord.getType(record);
                        if (typeName != null && typeName === selection.type) {
                            this._traverseSelections(selection.selections, record);
                        }
                    } else {
                        this._traverseSelections(selection.selections, record);
                    }
                    break;
                /*relay-forms case FRAGMENT_SPREAD:
          const previousVariables = this._variables;
          this._variables = getNoInlineFragmentVariables(
            selection,
            this._variables,
          );
          this._traverseSelections(selection.fragment.selections, record);
          this._variables = previousVariables;
          break;*/
                case LINKED_HANDLE:
                    // The selections for a "handle" field are the same as those of the
                    // original linked field where the handle was applied. Reference marking
                    // therefore requires traversing the original field selections against
                    // the synthesized client field.
                    //
                    // TODO: Instead of finding the source field in `selections`, change
                    // the concrete structure to allow shared subtrees, and have the linked
                    // handle directly refer to the same selections as the LinkedField that
                    // it was split from.
                    const handleField = cloneRelayHandleSourceField(
                        selection,
                        selections,
                        this._variables,
                    );
                    if (handleField.plural) {
                        this._traversePluralLink(handleField, record);
                    } else {
                        this._traverseLink(handleField, record);
                    }
                    break;
                case DEFER:
                case STREAM:
                    this._traverseSelections(selection.selections, record);
                    break;
                case SCALAR_FIELD:
                case SCALAR_HANDLE:
                    break;
                case TYPE_DISCRIMINATOR: {
                    break;
                }
                case MODULE_IMPORT:
                    //relay-formsthis._traverseModuleImport(selection, record);
                    break;
                case CLIENT_EXTENSION:
                    this._traverseSelections(selection.selections, record);
                    break;
                case CLIENT_COMPONENT:
                    /*if (this._shouldProcessClientComponents === false) {
            break;
          }
          this._traverseSelections(selection.fragment.selections, record);*/
                    break;
                default:
                    selection as any;
            }
        });
    }

    _traverseLink(field: any, record): void {
        const storageKey = getStorageKey(field, this._variables);
        const linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);

        if (linkedID == null) {
            return;
        }
        this._traverse(field, linkedID);
    }

    _traversePluralLink(field: any, record): void {
        const storageKey = getStorageKey(field, this._variables);
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
