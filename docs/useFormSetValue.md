---
id: use-form-set-value
title: useFormField
---

This hook allows you to define new fields that will be used in the validation and submit phase

**options**

```ts
export type FormSetValueOptions<ValueType> = {
    fieldKey: string;
    initialValue?: ValueType;
    validate?: (value: ValueType) => Promise<string | undefined> | string | undefined;
}
```

`fieldKey`: uniquely determines the field and is used as the key to the `values` object returned in the onSubmit function 

`initialValue`: [Optional] initial value of the field

`validate`: [Optional] function used to validate the value of the field

**return**


```ts
export type FormSetValueStateReturn<ValueType> = {
    error: undefined | null | Error;
    value: ValueType;
};

export type FormSetValueFunctionReturn<ValueType> = (newValue: ValueType) => void;

export type FormSetValueReturn<ValueType> = [
    FormSetValueStateReturn,
    FormSetValueFunctionReturn<ValueType>,
];
```

`error`: the hooks is updated when the validate function is invoked and its value can be read in this field
`value`: the hooks is updated when the setValue function is invoked and its value can be read in this field
`setValue`: This function should be used to update the value of the field


**example**

```tsx

const validate = (value: string) => {
    if (value && value.length < 5) {
        return 'error';
    }
    return undefined;
});

export const Field: React.FC<any> = ({ placeholder, fieldKey }) => {

    const [{ error, value }, setValue] = useFormField({
        key: fieldKey,
        validate,
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
                value={value}
                placeholder={placeholder}
                onChange={(value) => setValueCallback(value)}
            />
        </>
    );
};
```