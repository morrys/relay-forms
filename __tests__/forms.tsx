/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useCallback } from 'react';
import {
    Environment,
    Network,
    RecordSource,
    Store,
    RequestParameters,
    Variables,
} from 'relay-runtime';
import { RelayForm, useFormSubmit, useFormState, useFormSetValue } from '../src';

async function fetchQuery(operation: RequestParameters, variables: Variables) {
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    });

    return response.json();
}

export const environment: Environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

interface Props {
    promise?: boolean;
}

export const Form: React.FC<Props> = ({ promise }) => {
    const [state, setState] = React.useState(undefined);
    return (
        <RelayForm environment={environment}>
            <FormInternal
                onSubmit={promise ? (values) => Promise.resolve(setState(values)) : setState}
            />
            {state && <div data-testid={'submit-done'}>SUBMIT :)</div>}
        </RelayForm>
    );
};

export const HAVE_ERRORS = 'have errors';

export const Errors: React.FC<any> = () => {
    const { errors, isSubmitting, isValidating } = useFormState();
    return (
        <>
            <div data-testid={'errors'}>{errors ? HAVE_ERRORS : ''}</div>;
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

    const [{ error }, setValue] = useFormSetValue({
        key: fieldKey,
        validate: validate ? validateCallback : undefined,
        initialValue: 1,
    });

    const setValueCallback = useCallback(
        (event) => {
            const value = event.target.value;
            setValue(value);
        },
        [setValue],
    );
    ref.current += 1;
    return (
        <>
            {error && <div data-testid={fieldKey + '-error'}>{error}</div>}
            <input
                data-testid={fieldKey}
                type="text"
                value="1"
                placeholder={placeholder}
                onChange={(value) => setValueCallback(value)}
            />
            <div data-testid={fieldKey + '-count'}>{ref.current}</div>
        </>
    );
};
