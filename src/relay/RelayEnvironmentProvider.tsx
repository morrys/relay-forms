import * as React from 'react';
import { IEnvironment } from './RelayTypes';

const ReactRelayContext = React.createContext(null);

export const RelayEnvironmentProvider = function<
    TEnvironment extends IEnvironment = IEnvironment
>(props: { children: React.ReactNode; environment: TEnvironment }): JSX.Element {
    const context = React.useMemo(() => ({ environment: props.environment }), [props.environment]);
    return (
        <ReactRelayContext.Provider value={context}>{props.children}</ReactRelayContext.Provider>
    );
};

export function useRelayEnvironment<
    TEnvironment extends IEnvironment = IEnvironment
>(): TEnvironment {
    const { environment } = React.useContext(ReactRelayContext) as any;
    return environment as TEnvironment;
}
