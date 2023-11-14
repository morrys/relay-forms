import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { useForceUpdate } from 'relay-hooks/lib/useForceUpdate';
import { Snapshot, isPromise, IEnvironment } from 'relay-runtime';
import FragmentField, { queryFieldFragment$data } from './relay/queryFieldFragment.graphql';
import FragmentValueField, {
    queryValueFieldFragment$data,
} from './relay/queryValueFieldFragment.graphql';
import {
    FormSetValueOptions,
    FormSetValueReturn,
    FormSetValueStateReturn,
    ValidateFunction,
} from './RelayFormsTypes';
import { getSnapshot, getFieldId, commit } from './Utils';

type LogicParams<ValueType> = FormSetValueOptions<ValueType> & {
    environment: IEnvironment;
    forceUpdate: () => void;
};

type LogicReturn<ValueType> = {
    subscribe: () => void;
    getData: () => FormSetValueStateReturn<ValueType>;
    setValue: (newValue: ValueType) => void;
    setValidate: (
        validate: (value: ValueType) => Promise<string | undefined> | string | undefined,
    ) => void;
};
const INIT = 0;
export const TOBEVALIDATE = 1;
export const VALIDATING = 2;
const DONE = 3;
const DONEVALIDATED = 4;
export const RESET = 5;

function getInitCheck(validate): number {
    return validate ? TOBEVALIDATE : DONE;
}

export function isDone(check): boolean {
    return check === DONE || check === DONEVALIDATED;
}

function logicSetValue<ValueType>(params: LogicParams<ValueType>): LogicReturn<ValueType> {
    const {
        environment,
        key,
        initialValue,
        forceUpdate,
        validateOnChange,
        label,
        dependsOn,
    } = params;
    let validate = undefined;
    let firstSet = true;
    let deps = {};
    const localId = getFieldId(key);

    function getDeps(): any {
        return deps;
    }

    function getValidate(): ValidateFunction<ValueType> {
        return validate;
    }
    const ref = {
        check: INIT,
        isChecking: false,
    };

    let dataResult: FormSetValueStateReturn<ValueType> = {
        value: initialValue,
        error: undefined,
    };

    function commitField(commitValue = true): void {
        commit(environment, (store, form) => {
            let field: any = store.get(localId);
            if (!field) {
                field = store
                    .create(localId, 'Entry')
                    .setValue(localId, 'id')
                    .setValue(label, 'label')
                    .setValue(key, 'key');
                const entriesArray = form.getLinkedRecords('entries');
                entriesArray.push(field);
                form.setLinkedRecords(entriesArray, 'entries');
            }
            if (ref.check === VALIDATING) {
                form.setValue(true, 'isValidating');
            }
            field.setValue(ref.check, 'check').setValue(dataResult.error, 'error');
            if (commitValue) field.setValue__UNSAFE(dataResult.value, 'value');
        });
    }

    function setValidate(newValidate): void {
        if (validate === newValidate && !firstSet) {
            // first set only needs this
            return;
        }
        firstSet = false;
        validate = newValidate;

        // validation was called
        if (ref.check === DONEVALIDATED && validate) {
            ref.check = VALIDATING;
        } else {
            // reinit
            ref.check = getInitCheck(validate);
        }

        commitField();
    }
    function getData(): FormSetValueStateReturn<ValueType> {
        return dataResult;
    }

    function changeData(value, error): void {
        dataResult = {
            value,
            error,
        };
        forceUpdate();
    }

    function setValue(newValue: ValueType): void {
        setValueInternal(newValue, dataResult.error);
    }

    function setValueInternal(newValue: ValueType, error?): void {
        if (ref.check === DONEVALIDATED) {
            ref.check = VALIDATING;
        }
        changeData(newValue, error);
        commitField();
    }

    function finalizeCheck(error): void {
        ref.isChecking = false;
        ref.check = DONEVALIDATED;
        if (dataResult.error !== error) {
            changeData(dataResult.value, error);
        }
        commitField(false);
    }

    function internalValidate(value, validateFunction, depsValidation): void {
        ref.isChecking = true;
        const result = validateFunction(value, deps);
        function internalFinalize(error): void {
            const validate = getValidate();
            const deps = getDeps();
            if (
                value !== dataResult.value ||
                validate !== validateFunction ||
                deps !== depsValidation
            ) {
                internalValidate(dataResult.value, validate, deps);
                return;
            }
            finalizeCheck(error);
        }
        if (isPromise(result)) {
            (result as Promise<string | undefined>).then(internalFinalize).catch(internalFinalize);
        } else {
            internalFinalize(result);
        }
    }

    function subscribe(): () => void {
        const snapshot = getSnapshot(environment, FragmentField, key);

        const disposeSubscrition = environment.subscribe(snapshot, (s: Snapshot) => {
            const data: queryFieldFragment$data = (s as any).data;
            const dataCheck = data.check;
            const isValidating = dataCheck === VALIDATING;
            const isReset = dataCheck === RESET;
            ref.check = dataCheck;
            const validate = getValidate();
            if (isReset) {
                ref.check = getInitCheck(validate);
                setValueInternal(initialValue);
            } else if (isValidating && !ref.isChecking) {
                internalValidate(dataResult.value, validate, deps);
            }
        }).dispose;
        const disposeDeps = [];
        if (dependsOn != null) {
            dependsOn.forEach((depKey) => {
                const snapshot = getSnapshot(environment, FragmentValueField, depKey);
                const disposeDep = environment.subscribe(snapshot, (s: Snapshot) => {
                    const data: queryValueFieldFragment$data = (s as any).data;
                    deps = {
                        ...deps,
                        [depKey]: data,
                    };
                    if (ref.check == DONEVALIDATED && !ref.isChecking) {
                        ref.check = VALIDATING;
                        commitField(false);
                    }
                }).dispose;
                disposeDeps.push(disposeDep);
            });
        }

        const dispose = (): void => {
            disposeSubscrition();
            commit(environment, (store, form) => {
                const entriesArray = form.getLinkedRecords('entries');
                const newEntries = entriesArray.filter((value) => value.getDataID() != localId);
                form.setLinkedRecords(newEntries, 'entries');
                store.delete(localId);
            });
            disposeDeps.forEach((dispose) => dispose);
        };

        if (validateOnChange) {
            internalValidate(initialValue, getValidate(), deps);
        }
        return dispose;
    }

    return {
        subscribe,
        getData,
        setValue,
        setValidate,
    };
}

export function useFormField<ValueType>({
    key,
    initialValue,
    validate,
    validateOnChange,
    label,
    dependsOn,
}: FormSetValueOptions<ValueType>): FormSetValueReturn<ValueType> {
    const forceUpdate = useForceUpdate();
    const environment = useRelayEnvironment();

    const resolver = React.useMemo(() => {
        return logicSetValue({
            environment,
            key,
            label,
            initialValue,
            forceUpdate,
            validateOnChange,
            dependsOn,
        });
    }, [environment, key, initialValue, forceUpdate, validateOnChange, label, dependsOn]);

    resolver.setValidate(validate);

    React.useEffect(() => {
        return resolver.subscribe();
    }, [resolver]);

    return [resolver.getData(), resolver.setValue];
}
