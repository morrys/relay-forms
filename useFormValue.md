
## useFormValue

This hook allows you to find out the value of the field

**input parameters**

`key`: key of the field whose value you want to retrieve

**return**

```ts
export type FormValueStateReturn<ValueType> = {
    readonly id: string;
    readonly value: ValueType | null;
    readonly error: string | null;
};
```

`id`: unique id in the store
`error`: the field validation error
`value`: the value of the field


**example**

```tsx

export const Errors: React.FC<any> = () => {
    const data = useFormValue('firstName');
    return (
        <>
            <div>{data.error}</div>;
            <div>{data.value}</div>;
            <div>{data.id}</div>;
        </>
    );
};

```