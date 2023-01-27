import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { queryErrorsFieldQuery$data } from './relay/queryErrorsFieldQuery.graphql';
import { operationQueryErrorsForm } from './Utils';

export const useFormState = (): queryErrorsFieldQuery$data['form'] | null => {
    const environment = useRelayEnvironment();

    const snapshot = React.useMemo(() => {
        return environment.lookup(operationQueryErrorsForm.fragment);
    }, [environment]);

    const [data, setData] = React.useState(
        snapshot.data ? (snapshot.data as queryErrorsFieldQuery$data).form : null,
    );

    React.useEffect(() => {
        return environment.subscribe(snapshot, (s) => {
            setData((s.data as queryErrorsFieldQuery$data).form);
        }).dispose;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot]);
    return data;
};
