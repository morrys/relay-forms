import * as React from 'react';
import { ReactRelayContext } from './ReactRelayContext'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { IEnvironment } from './RelayTypes';

export const RelayEnvironmentProvider = function<
    TEnvironment extends IEnvironment = IEnvironment
>(props: { children: React.ReactNode; environment: TEnvironment }): JSX.Element {
    const context = React.useMemo(() => ({ environment: props.environment }), [props.environment]);
    return (
        <ReactRelayContext.Provider value={context}>{props.children}</ReactRelayContext.Provider>
    );
};
