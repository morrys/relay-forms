import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { Snapshot, isPromise, IEnvironment } from 'relay-runtime';
import { queryFieldQuery$data } from './relay/queryFieldQuery.graphql';
import { FormSubmitOptions, FunctionOnSubmit, FormSubmitReturn } from './RelayFormsTypes';
import { isDone } from './useFormSetValue';
import {
    commitValidateIntoRelay,
    commitSubmitEndRelay,
    operationQueryForm,
    commitResetIntoRelay,
    commitStateRelay,
} from './Utils';

export const useFormSubmit = <ValueType extends object = object>({
    onSubmit,
}: FormSubmitOptions<ValueType>): FormSubmitReturn => {
    const environment = useRelayEnvironment();

    const dispose = React.useCallback(() => {
        ref.current.subscription && ref.current.subscription.dispose();
        ref.current.subscription = null;
    }, []);

    React.useEffect(() => {
        return dispose;
    }, [dispose]);

    React.useEffect(() => {
        return environment.retain(operationQueryForm).dispose;
    }, [environment]);

    const ref = React.useRef({
        isSubmitting: false,
        subscription: undefined,
    });

    const execute = React.useCallback(
        (
            environment: IEnvironment,
            snapshot: Snapshot,
            dispose: () => void,
            onSubmit?: FunctionOnSubmit<object>,
        ): void => {
            const disposeSubmit = (): void => {
                ref.current.isSubmitting = false;
                commitSubmitEndRelay(environment);
            };
            const data: queryFieldQuery$data = (snapshot as any).data;
            const entries = data.form.entries;
            const filtered = entries.filter((value) => isDone(value.check));
            const isValidating = filtered.length !== entries.length;
            const errors = entries.filter((value) => !!value.error).map((value) => value.id);
            const isValid = !isValidating && errors.length === 0;
            commitStateRelay(environment, isValidating, isValid, errors);
            const isSubmitting = ref.current.isSubmitting;
            if (isValid && isSubmitting) {
                dispose();
                const result = {};
                entries.forEach((entry) => {
                    result[entry.key] = entry.value;
                });
                const submit = onSubmit(result);

                if (isPromise(submit)) {
                    (submit as Promise<void>).then(disposeSubmit).catch(disposeSubmit);
                    return;
                }
            } else if (!isValidating) {
                disposeSubmit();
            }
        },
        [],
    );

    const reset = React.useCallback(() => {
        if (!ref.current.isSubmitting) {
            dispose();
            commitResetIntoRelay(environment);
        }
    }, [environment, dispose]);

    const validate = React.useCallback(() => {
        const isSubmitting = ref.current.isSubmitting;
        const snapshot = environment.lookup(operationQueryForm.fragment);
        if (!ref.current.subscription) {
            ref.current.subscription = environment.subscribe(snapshot, (s) =>
                execute(environment, s, dispose, onSubmit),
            );
        }
        commitValidateIntoRelay(environment, isSubmitting);
        execute(environment, snapshot, dispose, onSubmit);
    }, [environment, execute, onSubmit, dispose]);

    const submit = React.useCallback(
        (event?: React.BaseSyntheticEvent<any>) => {
            event && event.preventDefault();
            if (!ref.current.isSubmitting) {
                ref.current.isSubmitting = true;
                validate();
            }
        },
        [validate],
    );

    const result = React.useMemo(() => {
        return {
            submit,
            validate,
            reset,
        };
    }, [submit, validate, reset]);
    return result;
};
