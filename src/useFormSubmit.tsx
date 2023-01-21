import * as React from 'react';
import { QueryFieldsData } from './relay/queries';
import { useStore } from './relay/RelayStoreProvider';
import { isPromise } from './relay/RelayStoreUtils';
import { Snapshot, Store } from './relay/RelayTypes';
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
    const environment = useStore();

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
        (snapshot: Snapshot, isSubmitting) => {
            ref.current.isValidating = true;
            const data: QueryFieldsData = (snapshot as any).data;
            const filtered = data.form.entries.filter((value) => value.check === 'INIT');
            commitValidateIntoRelay(filtered, isSubmitting, environment);
        },
        [environment],
    );

    const execute = React.useCallback(
        (
            environment: Store,
            snapshot: Snapshot,
            dispose: () => void,
            onSubmit?: FunctionOnSubmit<object>,
        ): void => {
            const data: QueryFieldsData = (snapshot as any).data;
            const entries = data.form.entries;
            const filtered = entries.filter((value) => value.check === 'DONE');
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
        const snapshot = environment.lookup(operationQueryForm.fragment);
        if (ref.current.isValidating && ref.current.isSubmitting) {
            return;
        }
        const data: QueryFieldsData = (snapshot as any).data;
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
        if (!ref.current.isValidating) {
            subscribe(false);
        }
    }, [subscribe]);

    const submit = React.useCallback(
        (event?: React.BaseSyntheticEvent<any>) => {
            if (event) {
                event.preventDefault();
            }

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
