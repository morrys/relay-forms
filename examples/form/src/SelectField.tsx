import * as React from 'react';
import { useFormSetValue } from './index';
import { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';

type TextFieldProps = {
    placeholder: string;
    fieldKey: string;
    validate?: (value: string) => string | undefined;
    children: any;
    width?: number;
};

export const SelectField: React.FC<TextFieldProps> = ({
    placeholder,
    fieldKey,
    validate,
    children,
    width = 330,
}) => {
    const [{ error, value }, setValue] = useFormSetValue({
        key: fieldKey,
        validate,
        initialValue: 'None',
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
            autoFocus
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
