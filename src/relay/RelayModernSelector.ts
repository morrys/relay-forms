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

const { ID_KEY } = RelayStoreUtils;

function createReaderSelector(node: any, dataID: string): any {
    return {
        //kind: 'SingularReaderSelector',
        dataID,
        node,
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
    return createReaderSelector(fragment, item[ID_KEY]);
}

export function createOperationDescriptor(request: any): any {
    const operationDescriptor = {
        fragment: createReaderSelector(request.fragment, RelayStoreUtils.ROOT_ID),
        identifier: request.identifier,
    };
    return operationDescriptor;
}
