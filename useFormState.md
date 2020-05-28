
## useFormState

This hook allows you to find out the state of the form

**input parameters**

No input parameters

**return**

```ts
export type FormStateReturn = {
    errors: ReadonlyArray<
        | {
              readonly id: string;
              readonly key: string;
              readonly error: string | null;
          }
        | null
        | undefined
    >;
    isValidating: boolean;
    isSubmitting: boolean;
};
```

`errors`: the values of all fields that contain errors are returned
`isValidating`: it is used to define when the form is being validated
`isSubmitting`: it is used to define when the form is being submitted


**example**

```tsx
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

```