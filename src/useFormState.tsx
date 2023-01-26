import * as areEqual from 'fbjs/lib/areEqual';
import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { useForceUpdate } from 'relay-hooks/lib/useForceUpdate';
import { Snapshot } from 'relay-runtime';
import { queryErrorsFieldQuery$data } from './relay/queryErrorsFieldQuery.graphql';
import { FormStateReturn } from './RelayFormsTypes';
import { isDone } from './useFormSetValue';
import { operationQueryErrorsForm } from './Utils';

export const useFormState = (): FormStateReturn => {
    const ref = React.useRef<FormStateReturn>({
        errors: undefined,
        isValidating: false,
        isSubmitting: false,
        isValid: false,
    });

    const forceUpdate = useForceUpdate();
    const environment = useRelayEnvironment();

    React.useEffect(() => {
        function checkError(s: Snapshot): void {
            const data: queryErrorsFieldQuery$data = (s as any).data;
            const form = data.form;
            const entries = form.entries;
            const current = ref.current;
            const entryErrors = entries.filter((value) => !!value.error);
            const entryValidated = entries.filter((value) => isDone(value.check));
            const errors = entryErrors.length > 0 ? entryErrors : undefined;
            const isValidating = form.isValidating;
            const isSubmitting = form.isSubmitting;

            const isValid =
                entries.length === entryValidated.length &&
                (!errors || Object.keys(errors).length === 0);
            const newState = {
                errors,
                isValid,
                isValidating,
                isSubmitting,
            };
            if (!areEqual(current, newState)) {
                ref.current = newState;
                forceUpdate();
            }
        }
        const snapshot = environment.lookup(operationQueryErrorsForm.fragment);
        checkError(snapshot);
        return environment.subscribe(snapshot, (s) => {
            checkError(s);
        }).dispose;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environment]);

    return ref.current;
};
