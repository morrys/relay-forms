import * as React from 'react';
import { Snapshot, getSingularSelector } from 'relay-runtime';
import { useRelayEnvironment } from 'relay-hooks';
import FragmentField from './relay/queryValueFieldFragment.graphql';
import { FormValueStateReturn } from './RelayFormsTypes';
import { getFieldId, operationQueryForm } from './Utils';

export function useFormValue<ValueType>(key: string): FormValueStateReturn<ValueType> {
    const environment = useRelayEnvironment();

    const snapshot = React.useMemo(() => {
        const fragment = FragmentField;
        const item = {
            __fragmentOwner: operationQueryForm,
            __fragments: { queryValueFieldFragment: {} },
            __id: getFieldId(key),
        };
        const selector = getSingularSelector(fragment, item);
        return environment.lookup(selector);
    }, [key, environment]);

    const [data, setData] = React.useState<FormValueStateReturn<any>>((snapshot as any).data);

    React.useEffect(() => {
        return environment.subscribe(snapshot, (s: Snapshot) => {
            setData((s as any).data);
        }).dispose;
    }, [environment, snapshot, setData]);

    return data;
}
