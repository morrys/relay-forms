export type FunctionOnSubmit<ValueType> = (values: ValueType) => Promise<void> | void;

export type FormSubmitOptions<ValueType> = {
    onSubmit: FunctionOnSubmit<ValueType>;
};

export type FormSubmitReturn = {
    submit: (event?: React.BaseSyntheticEvent<any, any, any>) => void;
    validate: () => void;
    reset: () => void;
};

export type FormSetValueOptions<ValueType> = {
    key: string;
    initialValue?: ValueType;
    validate?: (value: ValueType) => Promise<string | undefined> | string | undefined;
    validateOnChange?: boolean;
    label?: string;
};

export type FormSetValueStateReturn<ValueType> = {
    error: undefined | null | Error;
    value?: ValueType;
};

export type FormValueStateReturn<ValueType> = {
    readonly id: string;
    readonly value: ValueType | null;
    readonly error: string | null;
};

export type FormSetValueFunctionReturn<ValueType> = (newValue: ValueType) => void;

export type FormSetValueReturn<ValueType> = [
    FormSetValueStateReturn<ValueType>,
    FormSetValueFunctionReturn<ValueType>,
];

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
    isValid: boolean;
};
