import * as React from 'react';
import { Snapshot, getSingularSelector } from 'relay-runtime';
import FragmentField, {
    queryValueFieldFragment$data,
} from './relay/queryValueFieldFragment.graphql';
import { useRelayEnvironment } from './RelayForm';
import { FormSetValueReturn } from './RelayFormsTypes';
import { getFieldId, operationQueryForm } from './Utils';

export function useFormValue<ValueType>(key: string): FormSetValueReturn<ValueType> {
    const [data, setData] = React.useState(undefined);
    const environment = useRelayEnvironment();

    React.useEffect(() => {
        const fragment = FragmentField;
        const item = {
            __fragmentOwner: operationQueryForm,
            __fragments: { queryValueFieldFragment: {} },
            __id: getFieldId(key),
        };
        const selector = getSingularSelector(fragment, item);
        const snapshot = environment.lookup(selector);

        const data: queryValueFieldFragment$data = (snapshot as any).data;

        setData(data);

        return environment.subscribe(snapshot, (s: Snapshot) => {
            const data: queryValueFieldFragment$data = (s as any).data;
            setData(data);
        }).dispose;
    }, [environment, key, setData]);

    return data;
}
