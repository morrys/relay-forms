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

const { FRAGMENT_OWNER_KEY, FRAGMENTS_KEY, ID_KEY } = RelayStoreUtils;

export function createReaderSelector(fragment: any, dataID: string, request: any): any {
    return {
        kind: 'SingularReaderSelector',
        dataID,
        isWithinUnmatchedTypeRefinement: false,
        node: fragment,
        variables: {},
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
    if (
        typeof dataID === 'string' &&
        typeof fragments === 'object' &&
        fragments !== null &&
        typeof fragments[fragment.name] === 'object' &&
        fragments[fragment.name] !== null &&
        typeof mixedOwner === 'object' &&
        mixedOwner !== null
    ) {
        return createReaderSelector(fragment, dataID, mixedOwner);
    }

    return null;
}
