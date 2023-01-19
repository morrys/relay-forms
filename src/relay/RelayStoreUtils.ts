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

/**
 * Constants shared by all implementations of RecordSource/MutableRecordSource/etc.
 */
export const RelayStoreUtils = {
    FRAGMENTS_KEY: '__fragments',
    FRAGMENT_OWNER_KEY: '__fragmentOwner',
    ID_KEY: '__id',
    REF_KEY: '__ref',
    REFS_KEY: '__refs',
    ROOT_ID: 'client:root',
    ROOT_TYPE: '__Root',
    TYPENAME_KEY: '__typename',
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

export const RelayConcreteNode = {
    FRAGMENT: 'Fragment',
    LINKED_FIELD: 'LinkedField',
    OPERATION: 'Operation',
    REQUEST: 'Request',
    SCALAR_FIELD: 'ScalarField',
    VARIABLE: 'Variable',
};

export function getStorageKey(field): string {
    if (field.storageKey) {
        // TODO T23663664: Handle nodes do not yet define a static storageKey.
        return field.storageKey;
    }
    return field.name;
}

const hasWeakSetDefined = typeof WeakSet !== 'undefined';
const hasWeakMapDefined = typeof WeakMap !== 'undefined';

/**
 * Recycles subtrees from `prevData` by replacing equal subtrees in `nextData`.
 */
export function recycleNodesInto<T>(prevData: T, nextData: T): T {
    if (
        prevData === nextData ||
        typeof prevData !== 'object' ||
        prevData instanceof Set ||
        prevData instanceof Map ||
        (hasWeakSetDefined && prevData instanceof WeakSet) ||
        (hasWeakMapDefined && prevData instanceof WeakMap) ||
        !prevData ||
        typeof nextData !== 'object' ||
        nextData instanceof Set ||
        nextData instanceof Map ||
        (hasWeakSetDefined && nextData instanceof WeakSet) ||
        (hasWeakMapDefined && nextData instanceof WeakMap) ||
        !nextData
    ) {
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

const PREFIX = 'client:';

export function generateClientID(id, storageKey: string, index?: number): any {
    let key = id + ':' + storageKey;
    if (index != null) {
        key += ':' + index;
    }
    if (key.indexOf(PREFIX) !== 0) {
        key = PREFIX + key;
    }
    return key;
}

export function getStableStorageKey(name: string): string {
    return name;
}
