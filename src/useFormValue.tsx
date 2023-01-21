import * as React from 'react';
import { FragmentValue } from './relay/queries';
import { useStore } from './relay/RelayStoreProvider';
import { Snapshot } from './relay/RelayTypes';
import { FormValueStateReturn } from './RelayFormsTypes';
import { getSnapshot } from './Utils';

export function useFormValue<ValueType>(key: string): FormValueStateReturn<ValueType> {
    const environment = useStore();

    const snapshot = React.useMemo(() => {
        return getSnapshot(environment, FragmentValue, key);
    }, [key, environment]);

    const [data, setData] = React.useState<FormValueStateReturn<any>>((snapshot as any).data);

    React.useEffect(() => {
        return environment.subscribe(snapshot, (s: Snapshot) => {
            setData((s as any).data);
        }).dispose;
    }, [environment, snapshot, setData]);

    return data;
}
