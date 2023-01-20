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

function createNormalizationSelector(node: any, dataID: string): any {
    return { dataID, node };
}

/**
 * Creates an instance of the `OperationDescriptor` type defined in
 * `RelayStoreTypes` given an operation and some variables. The input variables
 * are filtered to exclude variables that do not match defined arguments on the
 * operation, and default values are populated for null values.
 */
export function createOperationDescriptor(request: any, dataID = RelayStoreUtils.ROOT_ID): any {
    const operationDescriptor = {
        fragment: createReaderSelector(request.fragment, dataID),
        request: {
            identifier: request.params.id,
            node: request,
        },
        root: createNormalizationSelector(request.operation, dataID),
    };
    return operationDescriptor;
}
