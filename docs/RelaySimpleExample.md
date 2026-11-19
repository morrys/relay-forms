---
id: relay-example
title: Simple Example
---

## Form Simple Example

```ts
import * as React from 'react';
// replace ... with relay-forms, react-relay-forms or relay-forms-nodeps
import { useFormSubmit, useFormState, useFormSetValue } from '...';

export const HAVE_ERRORS = 'have errors';

export const Errors: React.FC = () => {
    const { errors, isSubmitting, isValidating } = useFormState();
    return (
        <>
            <div>{errors ? HAVE_ERRORS : ''}</div>
            <div>{String(isSubmitting)}</div>
            <div>{String(isValidating)}</div>
        </>
    );
};

export const getFieldError = (name: string, value: string): string =>
    `${name} wrong length, minimum 5 current ${value.length}`;

const validateField = (value: string, name: string): string | undefined => {
    if (value && value.length < 5) {
        return getFieldError(name, value);
    }
    return undefined;
};

interface FormInternalProps {
    onSubmit: (values: Record<string, any>) => void | Promise<void>;
}

export const FormInternal: React.FC<FormInternalProps> = ({ onSubmit }) => {
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
            <button type="button" data-testid="button-validate" onClick={data.validate}>
                only validate
            </button>
            <button data-testid="button-submit" type="submit">
                submit
            </button>
        </form>
    );
};

interface FieldProps {
    placeholder?: string;
    fieldKey: string;
    validate?: (value: string, name: string) => string | undefined;
}

export const Field: React.FC<FieldProps> = ({ placeholder, fieldKey, validate }) => {
    const [{ value, error }, setValue] = useFormSetValue({
        key: fieldKey,
        validate: validate ? (val: string) => validate(val, fieldKey) : undefined,
        initialValue: 'try',
    });

    return (
        <>
            {error && <div>{error}</div>}
            <input
                type="text"
                value={value ?? ''}
                placeholder={placeholder}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setValue(event.target.value)
                }
            />
        </>
    );
};
```
