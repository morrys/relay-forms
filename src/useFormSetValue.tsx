import * as React from 'react';
import { useRelayEnvironment } from 'relay-hooks';
import { useForceUpdate } from 'relay-hooks/lib/useForceUpdate';
import { Snapshot, isPromise, IEnvironment } from 'relay-runtime';
import FragmentField, { queryFieldFragment$data } from './relay/queryFieldFragment.graphql';
import {
    FormSetValueOptions,
    FormSetValueReturn,
    FormSetValueStateReturn,
} from './RelayFormsTypes';
import { commitValue, commitError, commitDelete, getSnapshot } from './Utils';

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
export const DONEVALIDATED = 4;
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
        commitValue(key, label, dataResult.value, ref.check, environment);
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

    function setValueInternal(newValue: ValueType, error): void {
        if (ref.check === DONEVALIDATED) {
            ref.check = VALIDATING;
        }
        changeData(newValue, error);
        commitValue(key, label, newValue, ref.check, environment);
    }

    function finalizeCheck(error): void {
        ref.isChecking = false;
        if (dataResult.error !== error) {
            changeData(dataResult.value, error);
        }
        commitError(key, error, environment);
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
                setValueInternal(initialValue, undefined);
            } else if (isValidating && !ref.isChecking) {
                internalValidate(dataResult.value, validate);
            }
        }).dispose;

        const dispose = (): void => {
            disposeSubscrition();
            commitDelete(environment, key);
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
    const environment = useRelayEnvironment();

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
