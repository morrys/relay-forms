/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import { areEqual, RelayStoreUtils } from './RelayStoreUtils';

const { ID_KEY, REF_KEY, REFS_KEY } = RelayStoreUtils;

/**
 * @public
 *
 * Low-level record manipulation methods.
 *
 * A note about perf: we use long-hand property access rather than computed
 * properties in this file for speed ie.
 *
 *    const object = {};
 *    object[KEY] = value;
 *    record[storageKey] = object;
 *
 * instead of:
 *
 *    record[storageKey] = {
 *      [KEY]: value,
 *    };
 *
 * The latter gets transformed by Babel into something like:
 *
 *    function _defineProperty(obj, key, value) {
 *      if (key in obj) {
 *        Object.defineProperty(obj, key, {
 *          value: value,
 *          enumerable: true,
 *          configurable: true,
 *          writable: true,
 *        });
 *      } else {
 *        obj[key] = value;
 *      }
 *      return obj;
 *    }
 *
 *    record[storageKey] = _defineProperty({}, KEY, value);
 *
 * A quick benchmark shows that computed property access is an order of
 * magnitude slower (times in seconds for 100,000 iterations):
 *
 *               best     avg     sd
 *    computed 0.02175 0.02292 0.00113
 *      manual 0.00110 0.00123 0.00008
 */

/**
 * @public
 *
 * Create a new record.
 */
function create(dataID) {
    // See perf note above for why we aren't using computed property access.
    const record = {};
    record[ID_KEY] = dataID;
    return record;
}

/**
 * @public
 *
 * Get a scalar (non-link) field value.
 */
function getValue(record, storageKey) {
    return record[storageKey];
}

/**
 * @private
 *
 * Get the value of a field as a reference to another record. Throws if the
 * field has a different type.
 */
function getLinkedRecordKey(record, storageKey, key) {
    const link = record[storageKey];
    if (link == null) {
        return link;
    }
    return link[key];
}

/**
 * @public
 *
 * Get the value of a field as a reference to another record. Throws if the
 * field has a different type.
 */
function getLinkedRecordID(record, storageKey) {
    return getLinkedRecordKey(record, storageKey, REF_KEY);
}

/**
 * @public
 *
 * Get the value of a field as a list of references to other records. Throws if
 * the field has a different type.
 */
function getLinkedRecordIDs(record, storageKey: string) {
    return getLinkedRecordKey(record, storageKey, REFS_KEY);
}

/**
 * @public
 *
 * Compares the fields of a previous and new record, returning either the
 * previous record if all fields are equal or a new record (with merged fields)
 * if any fields have changed.
 */
function update(prevRecord, nextRecord) {
    let updated = null;
    const keys = Object.keys(nextRecord);
    for (let ii = 0; ii < keys.length; ii++) {
        const key = keys[ii];
        if (updated || !areEqual(prevRecord[key], nextRecord[key])) {
            updated = updated !== null ? updated : { ...prevRecord };
            updated[key] = nextRecord[key];
        }
    }
    return updated !== null ? updated : prevRecord;
}

/**
 * @public
 *
 * Set the value of a storageKey to a scalar.
 * YES
 */
function setValue(record, storageKey, value) {
    record[storageKey] = value;
}

/**
 * @private
 *
 * Get the value of a field as a reference to another record. Throws if the
 * field has a different type.
 */
function setLinkedRecordKey(record, storageKey, linkedID, key) {
    // See perf note above for why we aren't using computed property access.
    const link = {};
    link[key] = linkedID;
    record[storageKey] = link;
}

/**
 * @public
 *
 * Set the value of a field to a reference to another record.
 */
function setLinkedRecordID(record, storageKey: string, linkedID): void {
    setLinkedRecordKey(record, storageKey, linkedID, REF_KEY);
}

/**
 * @public
 *
 * Set the value of a field to a list of references other records.
 */
function setLinkedRecordIDs(record, storageKey: string, linkedIDs): void {
    setLinkedRecordKey(record, storageKey, linkedIDs, REFS_KEY);
}

export const RelayModernRecord = {
    create,
    getLinkedRecordID,
    getLinkedRecordIDs,
    getValue,
    setValue,
    setLinkedRecordID,
    setLinkedRecordIDs,
    update,
};
