import * as React from 'react';
import { QueryErrorsData } from './relay/queries';
import { useStore } from './relay/RelayStoreProvider';
import { areEqual } from './relay/RelayStoreUtils';
import { Snapshot } from './relay/RelayTypes';
import { FormStateReturn } from './RelayFormsTypes';
import { useForceUpdate } from './useForceUpdate';
import { operationQueryErrorsForm } from './Utils';

export const useFormState = (): FormStateReturn => {
    const ref = React.useRef<FormStateReturn>({
        errors: undefined,
        isValidating: false,
        isSubmitting: false,
        isValid: false,
    });

    const forceUpdate = useForceUpdate();
    const environment = useStore();

    React.useEffect(() => {
        function checkError(s: Snapshot): void {
            const data: QueryErrorsData = (s as any).data;
            const form = data.form;
            const entries = form.entries;
            const current = ref.current;
            const entryErrors = entries.filter((value) => !!value.error);
            const entryValidated = entries.filter((value) => value.check === 'DONE');
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
    }, [environment, forceUpdate]);

    return ref.current;
};
