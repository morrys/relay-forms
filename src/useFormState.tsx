import * as React from 'react';
import { QueryErrorsData } from './relay/queries';
import { useStore } from './relay/RelayStoreProvider';
import { operationQueryErrorsForm } from './Utils';
import { Snapshot } from './relay/RelayTypes';

export const useFormState = (): QueryErrorsData['form'] | null => {
    const environment = useStore();

    const snapshot: Snapshot = React.useMemo(() => {
        const s: any = environment.lookup(operationQueryErrorsForm.fragment);
        s.seenRecords.add('local:form');
        return s;
    }, [environment]);

    const [data, setData] = React.useState((snapshot.data as QueryErrorsData).form);

    React.useEffect(() => {
        return environment.subscribe(snapshot as any, (s) => {
            setData((s.data as QueryErrorsData).form);
        }).dispose;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot]);
    return data;
};
