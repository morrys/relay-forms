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
