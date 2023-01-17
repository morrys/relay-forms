import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useRelayEnvironment } from 'relay-hooks';
import { Snapshot, isPromise, IEnvironment } from 'relay-runtime';
import { queryFieldQuery$data } from './relay/queryFieldQuery.graphql';
import { FormSubmitOptions, FunctionOnSubmit, FormSubmitReturn } from './RelayFormsTypes';
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
        const disposable = environment.retain(operationQueryForm);
        return disposable.dispose;
    }, [environment]);

    const ref = React.useRef({
        isSubmitting: false,
        isValidating: false,
        error: undefined,
        subscription: undefined,
    });

    const internalValidate = React.useCallback(
        (snapshot: Snapshot, isSubmitting) => {
            ref.current.isValidating = true;
            const data: queryFieldQuery$data = (snapshot as any).data;
            const filtered = data.form.entries.filter((value) => value.check === 'INIT');
            commitValidateIntoRelay(filtered, isSubmitting, environment);
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
            const filtered = data.form.entries.filter((value) => value.check === 'DONE');
            if (filtered.length === data.form.entries.length) {
                const errors = data.form.entries.filter((value) => !!value.error);
                commitValidateEndRelay(environment);
                ref.current.isValidating = false;
                const internalDispose = (): void => {
                    dispose();
                    if (ref.current.isSubmitting) {
                        ref.current.isSubmitting = false;
                        commitSubmitEndRelay(environment);
                    }
                };
                if (ref.current.isSubmitting && onSubmit && (!errors || errors.length === 0)) {
                    const result = {};
                    data.form.entries.forEach((entry) => {
                        result[entry.key] = entry.value;
                    });
                    const submit = onSubmit(result);

                    if (isPromise(submit)) {
                        (submit as Promise<void>).then(internalDispose).catch(internalDispose);
                    } else {
                        internalDispose();
                    }
                } else {
                    internalDispose();
                }
            }
        },
        [],
    );

    const reset = React.useCallback(() => {
        const snapshot = environment.lookup(operationQueryForm.fragment);
        if (ref.current.isValidating && ref.current.isSubmitting) {
            return;
        }
        const data: queryFieldQuery$data = (snapshot as any).data;
        commitResetIntoRelay(data.form.entries, environment);
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
            internalValidate(snapshot, submit);
            execute(environment, snapshot, dispose, onSubmit);
        },
        [environment, internalValidate, execute, onSubmit],
    );

    const validate = React.useCallback(() => {
        if (ref.current.isValidating) {
            return;
        }
        subscribe(false);
    }, [subscribe]);

    const submit = React.useCallback(
        (event?: React.BaseSyntheticEvent<any>) => {
            if (event) {
                event.preventDefault();
            }

            if (ref.current.isSubmitting) {
                return;
            }

            ref.current.isSubmitting = true;
            subscribe(true);
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
