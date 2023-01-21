import * as React from 'react';
import { Store } from './RelayTypes';

const ReactRelayContext = React.createContext(null);

export const StoreProvider = function<TStore extends Store = Store>(props: {
    children: React.ReactNode;
    store: TStore;
}): JSX.Element {
    const context = React.useMemo(() => ({ store: props.store }), [props.store]);
    return (
        <ReactRelayContext.Provider value={context}>{props.children}</ReactRelayContext.Provider>
    );
};

export function useStore<TStore extends Store = Store>(): TStore {
    const { store } = React.useContext(ReactRelayContext) as any;
    return store as TStore;
}
