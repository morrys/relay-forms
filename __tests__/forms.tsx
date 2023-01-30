/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useCallback } from 'react';
import { StoreProvider, createStore, Store } from '../src/';
import { useFormSubmit, useFormState, useFormSetValue } from '../src/';

export const environment: Store = createStore();

interface Props {
    promise?: boolean;
    jestOnSubmit?: (values: any) => void;
}

export const Form: React.FC<Props> = ({ promise, jestOnSubmit }) => {
    const [state, setState] = React.useState(undefined);

    const submit = React.useCallback(
        (values) => {
            jestOnSubmit && jestOnSubmit(values);
            setState(values);
        },
        [setState, jestOnSubmit],
    );
    return (
        <StoreProvider store={environment}>
            <FormInternal
                onSubmit={promise ? (values) => Promise.resolve(submit(values)) : submit}
            />
            {state && <div data-testid={'submit-done'}>SUBMIT :)</div>}
        </StoreProvider>
    );
};

export const HAVE_ERRORS = 'have errors';

export const Errors: React.FC<any> = () => {
    const { errors, isSubmitting, isValidating } = useFormState();
    return (
        <>
            <div data-testid={'errors'}>{errors.length !== 0 ? HAVE_ERRORS : ''}</div>;
            <div data-testid={'isSubmitting'}>{'' + isSubmitting}</div>;
            <div data-testid={'isValidating'}>{'' + isValidating}</div>;
        </>
    );
};

const validateField = jest.fn((value: any, name: string) => {
    if (value && value.length < 5) {
        return getFieldError(name, value);
    }
    return undefined;
});

const validatePromiseField = jest.fn((value: any, name: string) => {
    if (value && value.length < 5) {
        return Promise.resolve(getFieldError(name, value));
    }
    return Promise.resolve(undefined);
});

const validateComplex = jest.fn((value: any, name: string) => {
    if (value && value.test && value.test.length < 5) {
        return getFieldError(name, value.test);
    }
    return undefined;
});

export const validateEmail = jest.fn(validateField);

export const validateFirstName = jest.fn(validatePromiseField);

//export const validateLastName = jest.fn(validateField);

export const FormInternal: React.FC<any> = ({ onSubmit }) => {
    const data = useFormSubmit({ onSubmit });
    return (
        <form onSubmit={data.submit} action="#">
            <div>
                <Field fieldKey="firstName" placeholder="first name" validate={validateFirstName} />
            </div>
            <div>
                <Field fieldKey="lastName" placeholder="last name" />
            </div>
            <div>
                <Field fieldKey="email" placeholder="email" validate={validateEmail} />
            </div>
            <div>
                <Field fieldKey="complex" placeholder="complex" validate={validateComplex} />
            </div>
            <Errors />
            <button type="button" data-testid={'button-validate'} onClick={data.validate}>
                only validate
            </button>
            <button data-testid={'button-submit'} type="submit">
                submit
            </button>
        </form>
    );
};

export const getFieldError = (name, value) =>
    name + ' wrong length, minimum 5 current ' + value.length;

export const Field: React.FC<any> = ({ placeholder, fieldKey, validate }) => {
    const ref = React.useRef(0);

    const validateCallback = useCallback(
        (value: any) => {
            return validate(value, fieldKey);
        },
        [fieldKey, validate],
    );

    const [{ error, value }, setValue] = useFormSetValue({
        key: fieldKey,
        validate: validate ? validateCallback : undefined,
        initialValue: 1,
    });

    const setValueCallback = useCallback(
        (event) => {
            const value = event.target.value;
            if (fieldKey === 'complex') {
                setValue({
                    test: value,
                });
            } else {
                setValue(value);
            }
        },
        [fieldKey, setValue],
    );
    ref.current += 1;
    return (
        <>
            {error && <div data-testid={fieldKey + '-error'}>{error}</div>}
            <input
                data-testid={fieldKey}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(value) => setValueCallback(value)}
            />
            <div data-testid={fieldKey + '-count'}>{ref.current}</div>
        </>
    );
};
