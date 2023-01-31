import * as React from 'react';
import { TextField as TextFieldMUI } from '@mui/material';
import { DELAY, useFormSetValue } from './index';
import { useCallback } from 'react';
import { sleep } from './Form';

export function required(value: string) {
    if (!value || value === 'None') {
        return 'It is required';
    }
    return undefined;
}

export async function validateMinFive(value: string) {
    await sleep(DELAY.validate);
    if (value && value.length < 5) {
        return 'Wrong length, minimum 5 current ' + value.length + ' (' + value + ')';
    }
    return undefined;
}

type TextFieldProps = {
    placeholder: string;
    fieldKey: string;
    initialValue?: string;
    validate?: (value: string) => string | undefined | Promise<string | undefined>;
};

export const InputField: React.FC<TextFieldProps> = ({
    placeholder,
    fieldKey,
    initialValue,
    validate,
}) => {
    const [{ error, value }, setValue] = useFormSetValue({
        key: fieldKey,
        validate,
        initialValue: initialValue ? initialValue : '',
        label: placeholder,
        //validateOnChange: true,
    });

    const setValueCallback = useCallback(
        (event) => {
            const value = event.target.value;
            setValue(value);
        },
        [setValue],
    );

    return (
        <TextFieldMUI
            margin="normal"
            style={{ width: 330, margin: 10 }}
            id={fieldKey}
            label={placeholder}
            error={!!error}
            helperText={error ? error : ''}
            value={value}
            variant="outlined"
            onChange={setValueCallback}
        />
    );
};
