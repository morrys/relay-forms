import * as React from 'react';
import { ReactRelayContext } from './ReactRelayContext';
import { IEnvironment } from './RelayTypes';

export function useRelayEnvironment<
    TEnvironment extends IEnvironment = IEnvironment
>(): TEnvironment {
    const { environment } = React.useContext(ReactRelayContext) as any;
    return environment as TEnvironment;
}
