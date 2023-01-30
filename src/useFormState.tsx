import * as React from 'react';
import { QueryErrorsData } from './relay/queries';
import { useStore } from './relay/RelayStoreProvider';
import { operationQueryErrorsForm } from './Utils';

export const useFormState = (): QueryErrorsData['form'] | null => {
    const environment = useStore();

    const snapshot = React.useMemo(() => {
        return environment.lookup(operationQueryErrorsForm.fragment);
    }, [environment]);

    const [data, setData] = React.useState((snapshot.data as QueryErrorsData).form);

    React.useEffect(() => {
        return environment.subscribe(snapshot, (s) => {
            setData((s.data as QueryErrorsData).form);
        }).dispose;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot]);
    return data;
};
