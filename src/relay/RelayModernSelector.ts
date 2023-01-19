/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// flowlint ambiguous-object-type:error

import { RelayStoreUtils } from './RelayStoreUtils';

import { Variables } from './RelayTypes';

const {
    FRAGMENT_OWNER_KEY,
    FRAGMENTS_KEY,
    ID_KEY,
    IS_WITHIN_UNMATCHED_TYPE_REFINEMENT,
} = RelayStoreUtils;

function getFragmentVariables(fragment, rootVariables, argumentVariables): any {
    let variables;
    fragment.argumentDefinitions.forEach((definition) => {
        if (argumentVariables.hasOwnProperty(definition.name)) {
            return;
        }
        // $FlowFixMe[cannot-spread-interface]
        variables = variables || { ...argumentVariables };
        switch (definition.kind) {
            case 'LocalArgument':
                variables[definition.name] = definition.defaultValue;
                break;
            case 'RootArgument':
                if (!rootVariables.hasOwnProperty(definition.name)) {
                    /*
                     * Global variables passed as values of @arguments are not required to
                     * be declared unless they are used by the callee fragment or a
                     * descendant. In this case, the root variable may not be defined when
                     * resolving the callee's variables. The value is explicitly set to
                     * undefined to conform to the check in
                     * RelayStoreUtils.getStableVariableValue() that variable keys are all
                     * present.
                     */
                    // $FlowFixMe[incompatible-use]
                    variables[definition.name] = undefined;
                    break;
                }
                // $FlowFixMe[incompatible-use]
                // $FlowFixMe[cannot-write]
                variables[definition.name] = rootVariables[definition.name];
                break;
            default:
                definition as any;
        }
    });
    return variables || argumentVariables;
}

export function createReaderSelector(
    fragment: any,
    dataID: string,
    variables: Variables,
    request: any,
    isWithinUnmatchedTypeRefinement = false,
): any {
    return {
        kind: 'SingularReaderSelector',
        dataID,
        isWithinUnmatchedTypeRefinement,
        node: fragment,
        variables,
        owner: request,
    };
}

/**
 * @public
 *
 * Given the result `item` from a parent that fetched `fragment`, creates a
 * selector that can be used to read the results of that fragment for that item.
 *
 * Example:
 *
 * Given two fragments as follows:
 *
 * ```
 * fragment Parent on User {
 *   id
 *   ...Child
 * }
 * fragment Child on User {
 *   name
 * }
 * ```
 *
 * And given some object `parent` that is the results of `Parent` for id "4",
 * the results of `Child` can be accessed by first getting a selector and then
 * using that selector to `lookup()` the results against the environment:
 *
 * ```
 * const childSelector = getSingularSelector(queryVariables, Child, parent);
 * const childData = environment.lookup(childSelector).data;
 * ```
 */
export function getSingularSelector(fragment, item): any {
    const dataID = item[ID_KEY];
    const fragments = item[FRAGMENTS_KEY];
    const mixedOwner = item[FRAGMENT_OWNER_KEY];
    const isWithinUnmatchedTypeRefinement = item[IS_WITHIN_UNMATCHED_TYPE_REFINEMENT] === true;
    if (
        typeof dataID === 'string' &&
        typeof fragments === 'object' &&
        fragments !== null &&
        typeof fragments[fragment.name] === 'object' &&
        fragments[fragment.name] !== null &&
        typeof mixedOwner === 'object' &&
        mixedOwner !== null
    ) {
        const owner = mixedOwner;
        const argumentVariables = fragments[fragment.name];

        const fragmentVariables = getFragmentVariables(
            fragment,
            owner.variables,
            argumentVariables,
        );
        return createReaderSelector(
            fragment,
            dataID,
            fragmentVariables,
            owner,
            isWithinUnmatchedTypeRefinement,
        );
    }

    return null;
}
