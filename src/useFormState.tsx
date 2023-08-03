import { useRelayEnvironment } from 'react-relay';
import * as React from 'react';
import { Snapshot } from 'relay-runtime';
import { queryErrorsFieldQuery$data } from './relay/queryErrorsFieldQuery.graphql';
import { operationQueryErrorsForm } from './Utils';

export const useFormState = (): queryErrorsFieldQuery$data['form'] | null => {
    const environment = useRelayEnvironment();

    const snapshot: Snapshot = React.useMemo(() => {
        const s: any = environment.lookup(operationQueryErrorsForm.fragment);
        s.seenRecords.add('local:form');
        return s;
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
