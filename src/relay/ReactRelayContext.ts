/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as invariant from 'fbjs/lib/invariant';
import * as React from 'react';

let relayContext;
let firstReact;

function createRelayContext(react): any {
    if (!relayContext) {
        relayContext = react.createContext(null);
        if ('production' !== process.env.NODE_ENV) {
            relayContext.displayName = 'RelayContext';
        }
        firstReact = react;
    }
    invariant(
        react === firstReact,
        '[createRelayContext]: You passing a different instance of React',
        react.version,
    );
    return relayContext;
}

export const ReactRelayContext = createRelayContext(React);
