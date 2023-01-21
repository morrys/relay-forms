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
export function isPromise(p: any): boolean {
    return !!p && typeof p.then === 'function';
}

'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const aStackPool = [];
const bStackPool = [];
/**
 * Checks if two values are equal. Values may be primitives, arrays, or objects.
 * Returns true if both arguments have the same keys and values.
 *
 * @see http://underscorejs.org
 * @copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * @license MIT
 */

export function areEqual(a, b) {
    const aStack = aStackPool.length ? aStackPool.pop() : [];
    const bStack = bStackPool.length ? bStackPool.pop() : [];
    const result = eq(a, b, aStack, bStack);
    aStack.length = 0;
    bStack.length = 0;
    aStackPool.push(aStack);
    bStackPool.push(bStack);
    return result;
}

function eq(a, b, aStack, bStack) {
    if (a === b) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        return a !== 0 || 1 / a == 1 / b;
    }

    if (a == null || b == null) {
        // a or b can be `null` or `undefined`
        return false;
    }

    if (typeof a != 'object' || typeof b != 'object') {
        return false;
    }

    const objToStr = Object.prototype.toString;
    const className = objToStr.call(a);

    if (className != objToStr.call(b)) {
        return false;
    }

    switch (className) {
        case '[object String]':
            return a == String(b);

        case '[object Number]':
            return isNaN(a) || isNaN(b) ? false : a == Number(b);

        case '[object Date]':
        case '[object Boolean]':
            return +a == +b;

        case '[object RegExp]':
            return (
                a.source == b.source &&
                a.global == b.global &&
                a.multiline == b.multiline &&
                a.ignoreCase == b.ignoreCase
            );
    } // Assume equality for cyclic structures.

    let length = aStack.length;

    // eslint-disable-next-line no-plusplus
    while (length--) {
        if (aStack[length] == a) {
            return bStack[length] == b;
        }
    }

    aStack.push(a);
    bStack.push(b);
    let size = 0; // Recursively compare objects and arrays.

    if (className === '[object Array]') {
        size = a.length;

        if (size !== b.length) {
            return false;
        } // Deep compare the contents, ignoring non-numeric properties.

        // eslint-disable-next-line no-plusplus
        while (size--) {
            if (!eq(a[size], b[size], aStack, bStack)) {
                return false;
            }
        }
    } else {
        if (a.constructor !== b.constructor) {
            return false;
        }

        if (a.hasOwnProperty('valueOf') && b.hasOwnProperty('valueOf')) {
            return a.valueOf() == b.valueOf();
        }

        const keys = Object.keys(a);

        if (keys.length != Object.keys(b).length) {
            return false;
        }

        for (let i = 0; i < keys.length; i++) {
            if (!eq(a[keys[i]], b[keys[i]], aStack, bStack)) {
                return false;
            }
        }
    }

    aStack.pop();
    bStack.pop();
    return true;
}

/**
 * Constants shared by all implementations of RecordSource/MutableRecordSource/etc.
 */
export const RelayStoreUtils = {
    ID_KEY: '__id',
    REF_KEY: '__ref',
    REFS_KEY: '__refs',
    ROOT_ID: 'client:root',
};

export enum RelayRecordState {
    /**
     * Record exists (either fetched from the server or produced by a local,
     * optimistic update).
     */
    EXISTENT = 'EXISTENT',

    /**
     * Record is known not to exist (either as the result of a mutation, or
     * because the server returned `null` when queried for the record).
     */
    NONEXISTENT = 'NONEXISTENT',

    /**
     * Record State is unknown because it has not yet been fetched from the
     * server.
     */
    UNKNOWN = 'UNKNOWN',
}

export const LINKED_FIELD = 'LinkedField';

//const hasWeakSetDefined = typeof WeakSet !== 'undefined';
//const hasWeakMapDefined = typeof WeakMap !== 'undefined';

function checkRecycleData(data) {
    return (
        typeof data !== 'object' ||
        data instanceof Set ||
        data instanceof Map ||
        //(hasWeakSetDefined && nextData instanceof WeakSet) ||
        //(hasWeakMapDefined && nextData instanceof WeakMap) ||
        !data
    );
}
/**
 * Recycles subtrees from `prevData` by replacing equal subtrees in `nextData`.
 */
export function recycleNodesInto<T>(prevData: T, nextData: T): T {
    if (prevData === nextData || checkRecycleData(prevData) || checkRecycleData(nextData)) {
        return nextData;
    }
    let canRecycle = false;

    // Assign local variables to preserve Flow type refinement.
    const prevArray = Array.isArray(prevData) ? prevData : null;
    const nextArray = Array.isArray(nextData) ? nextData : null;
    if (prevArray && nextArray) {
        canRecycle =
            nextArray.reduce((wasEqual, nextItem, ii) => {
                const prevValue = prevArray[ii];
                const nextValue = recycleNodesInto(prevValue, nextItem);
                if (nextValue !== nextArray[ii]) {
                    nextArray[ii] = nextValue;
                }
                return wasEqual && nextValue === prevArray[ii];
            }, true) && prevArray.length === nextArray.length;
    } else if (!prevArray && !nextArray) {
        // Assign local variables to preserve Flow type refinement.
        const prevObject = prevData;
        const nextObject = nextData;
        const prevKeys = Object.keys(prevObject);
        const nextKeys = Object.keys(nextObject);
        canRecycle =
            nextKeys.reduce((wasEqual, key) => {
                const prevValue = prevObject[key];
                const nextValue = recycleNodesInto(prevValue, nextObject[key]);
                if (nextValue !== nextObject[key]) {
                    nextObject[key] = nextValue;
                }
                return wasEqual && nextValue === prevObject[key];
            }, true) && prevKeys.length === nextKeys.length;
    }
    return canRecycle ? prevData : nextData;
}

const ITERATOR_KEY = Symbol.iterator;

export function hasOverlappingIDs(seenRecords, updatedRecordIDs): boolean {
    // $FlowFixMe: Set is an iterable type, accessing its iterator is allowed.
    const iterator = seenRecords[ITERATOR_KEY]();
    let next = iterator.next();
    while (!next.done) {
        const key = next.value;
        if (updatedRecordIDs.has(key)) {
            return true;
        }
        next = iterator.next();
    }
    return false;
}
