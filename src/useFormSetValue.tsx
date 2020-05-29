import * as React from 'react';
import { Snapshot, getSingularSelector, isPromise } from 'relay-runtime';
import FragmentField, { queryFieldFragment$data } from './relay/queryFieldFragment.graphql';
import { useRelayEnvironment } from './RelayForm';
import { FormSetValueOptions, FormSetValueReturn } from './RelayFormsTypes';
import { getFieldId, operationQueryForm, commitValue, commitErrorIntoRelay } from './Utils';

function isValidLeafValue(value): boolean {
    return (
        value == null ||
        typeof value !== 'object' ||
        (Array.isArray(value) && value.every(isValidLeafValue))
    );
}

export function useFormSetValue<ValueType>({
    key,
    initialValue,
    validate,
}: FormSetValueOptions<ValueType>): FormSetValueReturn<ValueType> {
    const [, forceUpdate] = React.useState(undefined);
    const environment = useRelayEnvironment();
    const ref = React.useRef({
        value: initialValue,
        error: undefined,
        touched: true,
        check: 'INIT',
        isChecking: false,
        serialize: false,
    });

    const setValue = React.useCallback(
        (newValue) => {
            const serialize = !isValidLeafValue(newValue);
            const value = serialize ? JSON.stringify(newValue) : newValue;
            ref.current.value = value;
            ref.current.serialize = serialize;
            ref.current.touched = true;
            commitValue(key, value, serialize, ref.current.check, environment);
        },
        [environment, key],
    );

    React.useEffect(() => {
        setValue(initialValue);
        const fragment = FragmentField;
        const item = {
            __fragmentOwner: operationQueryForm,
            __fragments: { queryFieldFragment: {} },
            __id: getFieldId(key),
        };
        const selector = getSingularSelector(fragment, item);
        const snapshot = environment.lookup(selector);

        function finalizeCheck(error): void {
            ref.current.isChecking = false;
            ref.current.touched = false;
            if (ref.current.error !== error) {
                ref.current.error = error;
                forceUpdate(error);
            }
            commitErrorIntoRelay(key, error, environment);
        }

        function internalValidate(value): void {
            ref.current.isChecking = true;
            const serializaValue = ref.current.serialize ? JSON.parse(value) : value;
            const result = validate(serializaValue);
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
        return environment.subscribe(snapshot, (s: Snapshot) => {
            const data: queryFieldFragment$data = (s as any).data;
            const isStart = data.check === 'START';
            ref.current.check = data.check;
            if (!validate) {
                commitErrorIntoRelay(key, undefined, environment);
                return;
            }
            if (isStart && !ref.current.isChecking) {
                internalValidate(ref.current.value);
            }
        }).dispose;
    }, [environment, initialValue, key, setValue, validate]);

    return [ref.current, setValue];
}
