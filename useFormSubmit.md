
## useFormSubmit

This hook allows you to define new fields that will be used in the validation and submit phase

**input parameters**

```ts
export type FunctionOnSubmit<ValueType> = (values: ValueType) => Promise<void> | void;

export type FormSubmitOptions<ValueType> = {
    onSubmit: FunctionOnSubmit<ValueType>;
};
```

`onSubmit`: this function is performed when the submit is called

**return**

```ts
export type FormSubmitReturn = {
    submit: (event?: React.BaseSyntheticEvent<any, any, any>) => void;
    validate: () => void;
};
```

`submit`: function to be used to invoke the form submission
`validate`: function to be used to force the validation of the form fields


**example**

```tsx
const { submit, validate } = useFormSubmit({ onSubmit: (values) => console.log("values", values)});

    return (
        <form onSubmit={submit} action="#">
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
            <button type="button" onClick={validate}>
                only validate
            </button>
            <button type="submit">
                submit
            </button>
        </form>
    );

```