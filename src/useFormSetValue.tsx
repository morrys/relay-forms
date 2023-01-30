import * as React from 'react';
import { FragmentSet, FragmentSetData } from './relay/queries';
import { useStore } from './relay/RelayStoreProvider';
import { isPromise } from './relay/RelayStoreUtils';
import { Snapshot, Store } from './relay/RelayTypes';
import {
    FormSetValueOptions,
    FormSetValueReturn,
    FormSetValueStateReturn,
} from './RelayFormsTypes';
import { useForceUpdate } from './useForceUpdate';
import { getSnapshot, getFieldId, commit } from './Utils';

type LogicParams<ValueType> = FormSetValueOptions<ValueType> & {
    environment: Store;
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
    const { environment, key, initialValue, forceUpdate, validateOnChange, label } = params;
    let validate = undefined;
    let firstSet = true;
    const localId = getFieldId(key);

    function getValidate(): (value: ValueType) => Promise<string | undefined> | string | undefined {
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
                    .create(localId)
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
            if (commitValue) field.setValue(dataResult.value, 'value');
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
        setValueInternal(newValue);
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

    function internalValidate(value, validateFunction): void {
        ref.isChecking = true;
        const result = validateFunction(value);
        function internalFinalize(error): void {
            const validate = getValidate();
            if (value !== dataResult.value || validate !== validateFunction) {
                internalValidate(dataResult.value, validate);
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
        const snapshot = getSnapshot(environment, FragmentSet, key);

        const disposeSubscrition = environment.subscribe(snapshot, (s: Snapshot) => {
            const data: FragmentSetData = (s as any).data;
            const dataCheck = data.check;
            const isValidating = dataCheck === VALIDATING;
            const isReset = dataCheck === RESET;
            ref.check = dataCheck;
            const validate = getValidate();
            if (isReset) {
                ref.check = getInitCheck(validate);
                setValueInternal(initialValue);
            } else if (isValidating && !ref.isChecking) {
                internalValidate(dataResult.value, validate);
            }
        }).dispose;

        const dispose = (): void => {
            disposeSubscrition();
            commit(environment, (store, form) => {
                const entriesArray = form.getLinkedRecords('entries');
                const newEntries = entriesArray.filter((value) => value.getDataID() != localId);
                form.setLinkedRecords(newEntries, 'entries');
                store.delete(localId);
            });
        };

        if (validateOnChange) {
            internalValidate(initialValue, getValidate());
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

export function useFormSetValue<ValueType>({
    key,
    initialValue,
    validate,
    validateOnChange,
    label,
}: FormSetValueOptions<ValueType>): FormSetValueReturn<ValueType> {
    const forceUpdate = useForceUpdate();
    const environment = useStore();

    const resolver = React.useMemo(() => {
        return logicSetValue({
            environment,
            key,
            label,
            initialValue,
            forceUpdate,
            validateOnChange,
        });
    }, [environment, key, initialValue, forceUpdate, validateOnChange, label]);

    resolver.setValidate(validate);

    React.useEffect(() => {
        return resolver.subscribe();
    }, [resolver]);

    return [resolver.getData(), resolver.setValue];
}
