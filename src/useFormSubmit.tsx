import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { Snapshot, isPromise, IEnvironment } from 'relay-runtime';
import { queryFieldQuery$data } from './relay/queryFieldQuery.graphql';
import { FormSubmitOptions, FunctionOnSubmit, FormSubmitReturn } from './RelayFormsTypes';
import { isDone } from './useFormSetValue';
import {
    commitValidateEndRelay,
    commitValidateIntoRelay,
    commitSubmitEndRelay,
    operationQueryForm,
    commitResetIntoRelay,
} from './Utils';

export const useFormSubmit = <ValueType extends object = object>({
    onSubmit,
}: FormSubmitOptions<ValueType>): FormSubmitReturn => {
    const environment = useRelayEnvironment();

    React.useEffect(() => {
        return environment.retain(operationQueryForm).dispose;
    }, [environment]);

    const ref = React.useRef({
        isSubmitting: false,
        isValidating: false,
        error: undefined,
        subscription: undefined,
    });

    const internalValidate = React.useCallback(
        (isSubmitting) => {
            ref.current.isValidating = true;
            commitValidateIntoRelay(environment, isSubmitting);
        },
        [environment],
    );

    const execute = React.useCallback(
        (
            environment: IEnvironment,
            snapshot: Snapshot,
            dispose: () => void,
            onSubmit?: FunctionOnSubmit<object>,
        ): void => {
            const data: queryFieldQuery$data = (snapshot as any).data;
            const entries = data.form.entries;
            const filtered = entries.filter((value) => isDone(value.check));
            if (filtered.length === entries.length) {
                const errors = entries.filter((value) => !!value.error);
                commitValidateEndRelay(environment);
                ref.current.isValidating = false;
                const internalDispose = (): void => {
                    dispose();
                    if (ref.current.isSubmitting) {
                        ref.current.isSubmitting = false;
                        commitSubmitEndRelay(environment);
                    }
                };
                if (ref.current.isSubmitting && onSubmit && errors.length === 0) {
                    const result = {};
                    entries.forEach((entry) => {
                        result[entry.key] = entry.value;
                    });
                    const submit = onSubmit(result);

                    if (isPromise(submit)) {
                        (submit as Promise<void>).then(internalDispose).catch(internalDispose);
                        return;
                    }
                }
                internalDispose();
            }
        },
        [],
    );

    const reset = React.useCallback(() => {
        if (!ref.current.isValidating && !ref.current.isSubmitting) {
            commitResetIntoRelay(environment);
        }
    }, [environment]);

    const subscribe = React.useCallback(
        (submit = false) => {
            const snapshot = environment.lookup(operationQueryForm.fragment);
            const { subscription } = ref.current;
            subscription && subscription.dispose();
            function dispose(): void {
                subscription && subscription.dispose();
                ref.current.subscription = null;
            }
            ref.current.subscription = environment.subscribe(snapshot, (s) =>
                execute(environment, s, dispose, onSubmit),
            );
            internalValidate(submit);
            execute(environment, snapshot, dispose, onSubmit);
        },
        [environment, internalValidate, execute, onSubmit],
    );

    const validate = React.useCallback(() => {
        if (!ref.current.isValidating) {
            subscribe(false);
        }
    }, [subscribe]);

    const submit = React.useCallback(
        (event?: React.BaseSyntheticEvent<any>) => {
            event && event.preventDefault();

            if (!ref.current.isSubmitting) {
                ref.current.isSubmitting = true;
                subscribe(true);
            }
        },
        [subscribe],
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
