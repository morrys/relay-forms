import * as React from 'react';
import { queryErrorsFieldQuery$data } from './relay/queryErrorsFieldQuery.graphql';
import { useStore } from './relay/RelayStoreProvider';
import { operationQueryErrorsForm } from './Utils';

export const useFormState = (): queryErrorsFieldQuery$data['form'] | null => {
    const environment = useStore();

    const snapshot = React.useMemo(() => {
        return environment.lookup(operationQueryErrorsForm.fragment);
    }, [environment]);

    const [data, setData] = React.useState((snapshot.data as queryErrorsFieldQuery$data).form);

    React.useEffect(() => {
        return environment.subscribe(snapshot, (s) => {
            setData((s.data as queryErrorsFieldQuery$data).form);
        }).dispose;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot]);
    return data;
};
