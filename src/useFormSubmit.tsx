import * as React from 'react';
import { queryFieldQuery$data } from './relay/queryFieldQuery.graphql';
import { useStore } from './relay/RelayStoreProvider';
import { isPromise } from './relay/RelayStoreUtils';
import { Snapshot, Store } from './relay/RelayTypes';
import { FormSubmitOptions, FormSubmitReturn } from './RelayFormsTypes';
import { isDone, RESET, TOBEVALIDATE, VALIDATING } from './useFormSetValue';
import { operationQueryForm, commit } from './Utils';

function logicSubmit(
    environment: Store,
    onSubmit,
): {
    getData: () => FormSubmitReturn;
    subscribe: () => () => void;
} {
    function dispose(): void {
        subscription && subscription.dispose();
        subscription = undefined;
    }

    let isSubmitting = false;
    let subscription;

    function execute(snapshot: Snapshot): void {
        const disposeSubmit = (): void => {
            isSubmitting = false;
            commit(environment, (_, form) => {
                form.setValue(false, 'isSubmitting');
            });
        };
        const data: queryFieldQuery$data = (snapshot as any).data;
        const entries = data.form.entries;
        const filtered = entries.filter((value) => isDone(value.check));
        const isValidating = filtered.length !== entries.length;
        const errors = entries.filter((value) => !!value.error).map((value) => value.id);
        const isValid = !isValidating && errors.length === 0;
        commit(environment, (store, form) => {
            form.setValue(isValidating, 'isValidating').setValue(isValid, 'isValid');
            const errorFields = [];
            errors.forEach((id) => {
                errorFields.push(store.get(id));
            });
            form.setLinkedRecords(errorFields, 'errors');
        });
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
    }

    function reset(): void {
        if (!isSubmitting) {
            dispose();
            commit(environment, (_, form) => {
                form.setValue(false, 'isSubmitting')
                    .setValue(false, 'isValidating')
                    .setLinkedRecords([], 'errors')
                    .getLinkedRecords('entries')
                    .forEach((entry: any) =>
                        entry.setValue(RESET, 'check').setValue(undefined, 'error'),
                    );
            });
        }
    }

    function validate(): void {
        commit(environment, (_, form) => {
            const tobeValitating = form
                .setValue(isSubmitting, 'isSubmitting')
                .getLinkedRecords('entries')
                .filter((value: any) => value.getValue('check') === TOBEVALIDATE);
            form.setValue(tobeValitating.length === 0, 'isValidating');
            tobeValitating.forEach((entry: any) => entry.setValue(VALIDATING, 'check'));
        });
        const snapshot = environment.lookup(operationQueryForm.fragment);
        if (!subscription) {
            subscription = environment.subscribe(snapshot, (s) => execute(s));
        }
        execute(snapshot);
    }

    function submit(event?: React.BaseSyntheticEvent<any>): void {
        event && event.preventDefault();
        if (!isSubmitting) {
            isSubmitting = true;
            validate();
        }
    }

    function subscribe(): () => void {
        const disposeRetain = environment.retain(operationQueryForm).dispose;
        return (): void => {
            dispose();
            disposeRetain();
        };
    }

    const result = {
        submit,
        validate,
        reset,
    };

    function getData(): FormSubmitReturn {
        return result;
    }

    return {
        subscribe,
        getData,
    };
}

export const useFormSubmit = <ValueType extends object = object>({
    onSubmit,
}: FormSubmitOptions<ValueType>): FormSubmitReturn => {
    const environment = useStore();

    const resolver = React.useMemo(() => logicSubmit(environment, onSubmit), [
        environment,
        onSubmit,
    ]);

    React.useEffect(() => {
        return resolver.subscribe();
    }, [resolver]);

    return resolver.getData();
};
