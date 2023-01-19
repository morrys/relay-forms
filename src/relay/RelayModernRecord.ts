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
import * as areEqual from 'fbjs/lib/areEqual';
import { RelayStoreUtils } from './RelayStoreUtils';

const { ID_KEY, REF_KEY, REFS_KEY, TYPENAME_KEY } = RelayStoreUtils;

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
 * Clone a record.
 */
function clone(record) {
    return {
        ...record,
    };
}

/**
 * @public
 *
 * Copies all fields from `source` to `sink`, excluding `__id` and `__typename`.
 *
 * NOTE: This function does not treat `id` specially. To preserve the id,
 * manually reset it after calling this function. Also note that values are
 * copied by reference and not value; callers should ensure that values are
 * copied on write.
 */
function copyFields(source, sink) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (key !== ID_KEY && key !== TYPENAME_KEY) {
                sink[key] = source[key];
            }
        }
    }
}

/**
 * @public
 *
 * Create a new record.
 */
function create(dataID, typeName) {
    // See perf note above for why we aren't using computed property access.
    const record = {};
    record[ID_KEY] = dataID;
    record[TYPENAME_KEY] = typeName;
    return record;
}

/**
 * @public
 *
 * Get the record's `id` if available or the client-generated identifier.
 */
function getDataID(record) {
    return record[ID_KEY] as any;
}

/**
 * @public
 *
 * Get the concrete type of the record.
 */
function getType(record) {
    return record[TYPENAME_KEY] as any;
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
 * @public
 *
 * Get the value of a field as a reference to another record. Throws if the
 * field has a different type.
 */
function getLinkedRecordID(record, storageKey) {
    const link = record[storageKey];
    if (link == null) {
        return link;
    }
    return link[REF_KEY];
}

/**
 * @public
 *
 * Get the value of a field as a list of references to other records. Throws if
 * the field has a different type.
 */
function getLinkedRecordIDs(record, storageKey: string) {
    const links = record[storageKey];
    if (links == null) {
        return links;
    }
    // assume items of the array are ids
    return links[REFS_KEY] as any;
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
 * Returns a new record with the contents of the given records. Fields in the
 * second record will overwrite identical fields in the first record.
 */
function merge(record1, record2) {
    return Object.assign({}, record1, record2);
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
 * @public
 *
 * Set the value of a field to a reference to another record.
 */
function setLinkedRecordID(record, storageKey: string, linkedID): void {
    // See perf note above for why we aren't using computed property access.
    const link = {};
    link[REF_KEY] = linkedID;
    record[storageKey] = link;
}

/**
 * @public
 *
 * Set the value of a field to a list of references other records.
 */
function setLinkedRecordIDs(record, storageKey: string, linkedIDs): void {
    // See perf note above for why we aren't using computed property access.
    const links = {};
    links[REFS_KEY] = linkedIDs;
    record[storageKey] = links;
}

export const RelayModernRecord = {
    clone, //
    copyFields,
    create,
    getDataID, //
    getLinkedRecordID,
    getLinkedRecordIDs,
    getType,
    getValue,
    merge, //
    setValue,
    setLinkedRecordID,
    setLinkedRecordIDs,
    update,
};
