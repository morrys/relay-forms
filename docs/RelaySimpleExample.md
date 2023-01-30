---
id: relay-example
title: Simple Example
---

## Form Simple Example

```ts
import * as React from 'react';
import { useCallback } from 'react';
// replace ... with relay-forms, react-relay-forms or relay-forms-nodeps
import { useFormSubmit, useFormState, useFormSetValue } from '...'; 

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