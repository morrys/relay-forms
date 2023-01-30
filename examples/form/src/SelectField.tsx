import * as React from 'react';
import { useFormSetValue } from './index';
import { useCallback } from 'react';
import TextField from '@mui/material/TextField';

type TextFieldProps = {
    placeholder: string;
    fieldKey: string;
    validate?: (value: string) => string | undefined;
    children: any;
    width?: number;
    initialValue?: string;
};

export const SelectField: React.FC<TextFieldProps> = ({
    placeholder,
    fieldKey,
    validate,
    children,
    width = 330,
    initialValue = 'None',
}) => {
    const [{ error, value }, setValue] = useFormSetValue({
        key: fieldKey,
        validate,
        initialValue,
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
        <TextField
            margin="normal"
            style={{ width, margin: 10 }}
            id={fieldKey}
            label={placeholder}
            error={!!error}
            helperText={error ? error : ''}
            value={value}
            variant="outlined"
            onChange={setValueCallback}
            select
        >
            {children}
        </TextField>
    );
};
