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

import { RelayRecordSourceMapImpl } from './RelayRecordSourceMapImpl';
import { MutableRecordSource } from './RelayTypes';

export class RelayRecordSource {
    constructor(records?) {
        return RelayRecordSource.create(records);
    }

    static create(records?): MutableRecordSource {
        return new RelayRecordSourceMapImpl(records);
    }
}
