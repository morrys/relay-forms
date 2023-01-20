import * as React from 'react';
import FragmentValueField from './relay/queryValueFieldFragment.graphql';
import { useRelayEnvironment } from './relay/RelayEnvironmentProvider';
import { Snapshot } from './relay/RelayTypes';
import { FormValueStateReturn } from './RelayFormsTypes';
import { getSnapshot } from './Utils';

export function useFormValue<ValueType>(key: string): FormValueStateReturn<ValueType> {
    const environment = useRelayEnvironment();

    const snapshot = React.useMemo(() => {
        return getSnapshot(environment, FragmentValueField, key);
    }, [key, environment]);

    const [data, setData] = React.useState<FormValueStateReturn<any>>((snapshot as any).data);

    React.useEffect(() => {
        return environment.subscribe(snapshot, (s: Snapshot) => {
            setData((s as any).data);
        }).dispose;
    }, [environment, snapshot, setData]);

    return data;
}
