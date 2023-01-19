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

'use strict';

import { createReaderSelector } from './RelayModernSelector';
import { RelayStoreUtils } from './RelayStoreUtils';

function getRequestIdentifier(parameters): any {
    return parameters.cacheID != null ? parameters.cacheID : parameters.id;
}

function createNormalizationSelector(node: any, dataID: string): any {
    return { dataID, node, variables: {} };
}

/**
 * Creates an instance of the `OperationDescriptor` type defined in
 * `RelayStoreTypes` given an operation and some variables. The input variables
 * are filtered to exclude variables that do not match defined arguments on the
 * operation, and default values are populated for null values.
 */
export function createOperationDescriptor(
    request: any,
    cacheConfig?,
    dataID = RelayStoreUtils.ROOT_ID,
): any {
    const requestDescriptor = createRequestDescriptor(request, cacheConfig);
    const operationDescriptor = {
        fragment: createReaderSelector(request.fragment, dataID, requestDescriptor),
        request: requestDescriptor,
        root: createNormalizationSelector(request.operation, dataID),
    };
    return operationDescriptor;
}

function createRequestDescriptor(request, cacheConfig): any {
    const requestDescriptor = {
        identifier: getRequestIdentifier(request.params),
        node: request,
        variables: {},
        cacheConfig: cacheConfig,
    };
    return requestDescriptor;
}
