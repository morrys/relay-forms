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

export function isPromise(p: any): boolean {
    return !!p && typeof p.then === 'function';
}

/**
 * Constants shared by all implementations of RecordSource/MutableRecordSource/etc.
 */
export const RelayStoreUtils = {
    FRAGMENTS_KEY: '__fragments',
    FRAGMENT_OWNER_KEY: '__fragmentOwner',
    FRAGMENT_PROP_NAME_KEY: '__fragmentPropName',
    MODULE_COMPONENT_KEY: '__module_component', // alias returned by Reader
    ID_KEY: '__id',
    REF_KEY: '__ref',
    REFS_KEY: '__refs',
    ROOT_ID: 'client:root',
    ROOT_TYPE: '__Root',
    TYPENAME_KEY: '__typename',
    INVALIDATED_AT_KEY: '__invalidated_at',
    IS_WITHIN_UNMATCHED_TYPE_REFINEMENT: '__isWithinUnmatchedTypeRefinement',
    RELAY_RESOLVER_VALUE_KEY: '__resolverValue',
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
    CONDITION: 'Condition',
    CLIENT_COMPONENT: 'ClientComponent',
    CLIENT_EXTENSION: 'ClientExtension',
    DEFER: 'Defer',
    CONNECTION: 'Connection',
    FLIGHT_FIELD: 'FlightField',
    FRAGMENT: 'Fragment',
    FRAGMENT_SPREAD: 'FragmentSpread',
    INLINE_DATA_FRAGMENT_SPREAD: 'InlineDataFragmentSpread',
    INLINE_DATA_FRAGMENT: 'InlineDataFragment',
    INLINE_FRAGMENT: 'InlineFragment',
    LINKED_FIELD: 'LinkedField',
    LINKED_HANDLE: 'LinkedHandle',
    LITERAL: 'Literal',
    LIST_VALUE: 'ListValue',
    LOCAL_ARGUMENT: 'LocalArgument',
    MODULE_IMPORT: 'ModuleImport',
    RELAY_RESOLVER: 'RelayResolver',
    REQUIRED_FIELD: 'RequiredField',
    OBJECT_VALUE: 'ObjectValue',
    OPERATION: 'Operation',
    REQUEST: 'Request',
    ROOT_ARGUMENT: 'RootArgument',
    SCALAR_FIELD: 'ScalarField',
    SCALAR_HANDLE: 'ScalarHandle',
    SPLIT_OPERATION: 'SplitOperation',
    STREAM: 'Stream',
    TYPE_DISCRIMINATOR: 'TypeDiscriminator',
    VARIABLE: 'Variable',
};

function getRelayHandleKey(handleName: string, key, fieldName): string {
    if (key && key !== '') {
        return `__${key}_${handleName}`;
    }
    return `__${fieldName}_${handleName}`;
}

function getStableVariableValue(name: string, variables): any {
    return stableCopy(variables[name]);
}

function getArgumentValue(arg, variables): any {
    if (arg.kind === RelayConcreteNode.VARIABLE) {
        // Variables are provided at runtime and are not guaranteed to be stable.
        return getStableVariableValue(arg.variableName, variables);
    } else if (arg.kind === RelayConcreteNode.LITERAL) {
        // The Relay compiler generates stable ConcreteArgument values.
        return arg.value;
    } else if (arg.kind === RelayConcreteNode.OBJECT_VALUE) {
        const value = {};
        arg.fields.forEach((field) => {
            value[field.name] = getArgumentValue(field, variables);
        });
        return value;
    } else if (arg.kind === RelayConcreteNode.LIST_VALUE) {
        const value = [];
        arg.items.forEach((item) => {
            item != null ? value.push(getArgumentValue(item, variables)) : null;
        });
        return value;
    }
}

/**
 * Returns the values of field/fragment arguments as an object keyed by argument
 * names. Guaranteed to return a result with stable ordered nested values.
 */
export function getArgumentValues(args, variables) {
    const values = {};
    args.forEach((arg) => {
        values[arg.name] = getArgumentValue(arg, variables);
    });
    return values;
}

function getHandleStorageKey(handleField, variables): string {
    const { dynamicKey, handle, key, name, args, filters } = handleField;
    const handleName = getRelayHandleKey(handle, key, name);
    let filterArgs = null;
    if (args && filters && args.length !== 0 && filters.length !== 0) {
        filterArgs = args.filter((arg) => filters.indexOf(arg.name) > -1);
    }
    if (dynamicKey) {
        // "Sort" the arguments by argument name: this is done by the compiler for
        // user-supplied arguments but the dynamic argument must also be in sorted
        // order.  Note that dynamic key argument name is double-underscore-
        // -prefixed, and a double-underscore prefix is disallowed for user-supplied
        // argument names, so there's no need to actually sort.
        filterArgs = filterArgs != null ? [dynamicKey, ...filterArgs] : [dynamicKey];
    }
    if (filterArgs === null) {
        return handleName;
    } else {
        return formatStorageKey(handleName, getArgumentValues(filterArgs, variables));
    }
}

export function cloneRelayHandleSourceField(handleField, selections, variables): any {
    const sourceField = selections.find(
        (source) =>
            source.kind === RelayConcreteNode.LINKED_FIELD &&
            source.name === handleField.name &&
            source.alias === handleField.alias &&
            areEqual(source.args, handleField.args),
    );
    const handleKey = getHandleStorageKey(handleField, variables);
    return {
        kind: 'LinkedField',
        alias: sourceField.alias,
        name: handleKey,
        storageKey: handleKey,
        args: null,
        concreteType: sourceField.concreteType,
        plural: sourceField.plural,
        selections: sourceField.selections,
    };
}

export function getStorageKey(field, variables): string {
    if (field.storageKey) {
        // TODO T23663664: Handle nodes do not yet define a static storageKey.
        return field.storageKey;
    }
    const args = typeof field.args === 'undefined' ? undefined : field.args;
    const name = field.name;
    return args && args.length !== 0
        ? formatStorageKey(name, getArgumentValues(args, variables))
        : name;
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

export function stableCopy(value): any {
    if (!value || typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(stableCopy);
    }
    const keys = Object.keys(value).sort();
    const stable = {};
    for (let i = 0; i < keys.length; i++) {
        stable[keys[i]] = stableCopy(value[keys[i]]);
    }
    return stable as any;
}

export function getStableStorageKey(name: string, args): string {
    return formatStorageKey(name, stableCopy(args));
}

/**
 * Given a name and argument values, format a storage key.
 *
 * Arguments and the values within them are expected to be ordered in a stable
 * alphabetical ordering.
 */
function formatStorageKey(name: string, argValues): string {
    if (!argValues) {
        return name;
    }
    const values = [];
    for (const argName in argValues) {
        if (argValues.hasOwnProperty(argName)) {
            const value = argValues[argName];
            if (value != null) {
                values.push(argName + ':' + (JSON.stringify(value) ?? 'undefined'));
            }
        }
    }
    return values.length === 0 ? name : name + `(${values.join(',')})`;
}
