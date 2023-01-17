---
id: relay-forms
title: Getting Started
---

# react-relay-forms ![](https://github.com/morrys/relay-forms/workflows/Build/badge.svg)
Build forms in React with Relay

## Installation

Install relay-forms and relay-runtime using yarn or npm:

```
yarn add relay-forms relay-runtime
```

## Contributing

* **Give a star** to the repository and **share it**, you will **help** the **project** and the **people** who will find it useful

* **Create issues**, your **questions** are a **valuable help**

* **PRs are welcome**, but it is always **better to open the issue first** so as to **help** me and other people **evaluating it**

* **Please sponsor me**

## Simple Example

```ts
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
import { RelayEnvironmentProvider } from 'react-relay';
import { useFormSubmit, useFormState, useFormSetValue } from 'relay-forms';

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

export const Form: React.FC = () => {
    const [state, setState] = React.useState(undefined);
    return (
        <RelayEnvironmentProvider environment={environment}>
            <FormInternal
                onSubmit={setState}
            />
            {state && <div data-testid={'submit-done'}>SUBMIT :)</div>}
        </RelayEnvironmentProvider>
    );
};

export const HAVE_ERRORS = 'have errors';

export const Errors: React.FC<any> = () => {
    const { errors, isSubmitting, isValidating } = useFormState();
    return (
        <>
            <div>{errors ? HAVE_ERRORS : ''}</div>;
            <div>{'' + isSubmitting}</div>;
            <div>{'' + isValidating}</div>;
        </>
    );
};

const validateField = (value: any, name: string) => {
    if (value && value.length < 5) {
        return getFieldError(name, value);
    }
    return undefined;
});

export const FormInternal: React.FC<any> = ({ onSubmit }) => {
    const data = useFormSubmit({ onSubmit });

    return (
        <form onSubmit={data.submit} action="#">
            <div>
                <Field fieldKey="firstName" placeholder="first name" validate={validateField} />
            </div>
            <div>
                <Field fieldKey="lastName" placeholder="last name" />
            </div>
            <div>
                <Field fieldKey="email" placeholder="email" validate={validateField} />
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
    const validateCallback = useCallback(
        (value: any) => {
            return validate(value, fieldKey);
        },
        [fieldKey, validate],
    );

    const [{ error }, setValue] = useFormSetValue({
        key: fieldKey,
        validate: validate ? validateCallback : undefined,
        initialValue: "try",
    });

    const setValueCallback = useCallback(
        (event) => {
            const value = event.target.value;
            setValue(value);
        },
        [setValue],
    );
    return (
        <>
            {error && <div>{error}</div>}
            <input
                type="text"
                value="try"
                placeholder={placeholder}
                onChange={(value) => setValueCallback(value)}
            />
        </>
    );
};
```