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
import { RelayStoreUtils, stableCopy } from './RelayStoreUtils';
import { Variables } from './RelayTypes';

function getRequestIdentifier(parameters, variables): any {
    const requestID = parameters.cacheID != null ? parameters.cacheID : parameters.id;
    return requestID + JSON.stringify(stableCopy(variables));
}

function getOperationVariables(operation, variables): any {
    const operationVariables = {};
    operation.argumentDefinitions.forEach((def) => {
        let value = def.defaultValue;
        // $FlowFixMe[cannot-write]
        if (variables[def.name] != null) {
            value = variables[def.name];
        }
        operationVariables[def.name] = value;
    });
    return operationVariables;
}

function createNormalizationSelector(node: any, dataID: string, variables: Variables): any {
    return { dataID, node, variables };
}

/**
 * Creates an instance of the `OperationDescriptor` type defined in
 * `RelayStoreTypes` given an operation and some variables. The input variables
 * are filtered to exclude variables that do not match defined arguments on the
 * operation, and default values are populated for null values.
 */
export function createOperationDescriptor(
    request: any,
    variables,
    cacheConfig?,
    dataID = RelayStoreUtils.ROOT_ID,
): any {
    const operation = request.operation;
    const operationVariables = getOperationVariables(operation, variables);
    const requestDescriptor = createRequestDescriptor(request, operationVariables, cacheConfig);
    const operationDescriptor = {
        fragment: createReaderSelector(
            request.fragment,
            dataID,
            operationVariables,
            requestDescriptor,
        ),
        request: requestDescriptor,
        root: createNormalizationSelector(operation, dataID, operationVariables),
    };
    return operationDescriptor;
}

function createRequestDescriptor(request, variables, cacheConfig): any {
    const requestDescriptor = {
        identifier: getRequestIdentifier(request.params, variables),
        node: request,
        variables: variables,
        cacheConfig: cacheConfig,
    };
    return requestDescriptor;
}
