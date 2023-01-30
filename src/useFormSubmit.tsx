import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { Snapshot, isPromise, IEnvironment } from 'relay-runtime';
import { queryFieldQuery$data } from './relay/queryFieldQuery.graphql';
import { FormSubmitOptions, FormSubmitReturn } from './RelayFormsTypes';
import { isDone } from './useFormSetValue';
import {
    commitValidate,
    commitSubmit,
    operationQueryForm,
    commitReset,
    commitState,
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
        (environment: IEnvironment, snapshot: Snapshot): void => {
            const disposeSubmit = (): void => {
                ref.current.isSubmitting = false;
                commitSubmit(environment);
            };
            const data: queryFieldQuery$data = (snapshot as any).data;
            const entries = data.form.entries;
            const filtered = entries.filter((value) => isDone(value.check));
            const isValidating = filtered.length !== entries.length;
            const errors = entries.filter((value) => !!value.error).map((value) => value.id);
            const isValid = !isValidating && errors.length === 0;
            commitState(environment, isValidating, isValid, errors);
            const isSubmitting = ref.current.isSubmitting;
            if (isValid && isSubmitting) {
                dispose();
                const result: any = {};
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
        [dispose, onSubmit],
    );

    const reset = React.useCallback(() => {
        if (!ref.current.isSubmitting) {
            dispose();
            commitReset(environment);
        }
    }, [environment, dispose]);

    const validate = React.useCallback(() => {
        commitValidate(environment, ref.current.isSubmitting);
        const snapshot = environment.lookup(operationQueryForm.fragment);
        if (!ref.current.subscription) {
            ref.current.subscription = environment.subscribe(snapshot, (s) =>
                execute(environment, s),
            );
        }
        execute(environment, snapshot);
    }, [environment, execute]);

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
