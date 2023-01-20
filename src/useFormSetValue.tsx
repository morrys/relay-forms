import * as React from 'react';
import FragmentField, { queryFieldFragment$data } from './relay/queryFieldFragment.graphql';
import { useRelayEnvironment } from './relay/RelayEnvironmentProvider';
import { isPromise } from './relay/RelayStoreUtils';
import { Snapshot } from './relay/RelayTypes';
import { FormSetValueOptions, FormSetValueReturn } from './RelayFormsTypes';
import { useForceUpdate } from './useForceUpdate';
import { commitValue, commitErrorIntoRelay, commitResetField, getSnapshot } from './Utils';

export function useFormSetValue<ValueType>({
    key,
    initialValue,
    validate,
    validateOnChange,
}: FormSetValueOptions<ValueType>): FormSetValueReturn<ValueType> {
    const forceUpdate = useForceUpdate();
    const environment = useRelayEnvironment();
    const ref = React.useRef({
        value: initialValue,
        error: undefined,
        check: validate ? 'INIT' : 'DONE',
        isChecking: false,
    });

    const setValue = React.useCallback(
        (newValue) => {
            ref.current.value = newValue;
            if (ref.current.check === 'DONE' && validate) {
                ref.current.check = 'START';
            }
            commitValue(key, newValue, ref.current.check, environment);
            forceUpdate();
        },
        [environment, key, validate, forceUpdate],
    );

    React.useEffect(() => {
        //commitResetField(environment, key);
        commitValue(key, initialValue, ref.current.check, environment);
        const snapshot = getSnapshot(environment, FragmentField, key);

        const disposeSubscrition = environment.subscribe(snapshot, (s: Snapshot) => {
            const data: queryFieldFragment$data = (s as any).data;
            const isStart = data.check === 'START';
            const isReset = data.check === 'RESET';
            ref.current.check = data.check;
            if (isReset) {
                ref.current.check = validate ? 'INIT' : 'DONE';
                setValue(initialValue);
            } else {
                if (!validate) {
                    commitErrorIntoRelay(key, undefined, environment);
                    return;
                }
                if (isStart && !ref.current.isChecking) {
                    internalValidate(ref.current.value);
                }
            }
        }).dispose;

        const dispose = (): void => {
            disposeSubscrition();
            commitResetField(environment, key);
        };

        function finalizeCheck(error): void {
            ref.current.isChecking = false;
            if (ref.current.error !== error) {
                ref.current.error = error;
                forceUpdate();
            }
            commitErrorIntoRelay(key, error, environment);
        }

        function internalValidate(value): void {
            ref.current.isChecking = true;
            const result = validate(value);
            function internalFinalize(error): void {
                if (value !== ref.current.value) {
                    internalValidate(ref.current.value);
                    return;
                }
                finalizeCheck(error);
            }
            if (isPromise(result)) {
                (result as Promise<string | undefined>)
                    .then(internalFinalize)
                    .catch(internalFinalize);
            } else {
                internalFinalize(result);
            }
        }
        if (validateOnChange) {
            internalValidate(initialValue);
        }
        return dispose;
    }, [environment, initialValue, key, setValue, validate, validateOnChange, forceUpdate]);

    return [ref.current, setValue];
}
