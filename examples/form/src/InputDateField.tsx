import * as React from 'react';
import { useFormField } from './index';
import { TextField as TextFieldMUI } from '@mui/material';

export type InputDateFieldType = Date | undefined;

const initialValue = new Date();

export const InputDateField: React.FC<any> = ({ fieldKey, placeholder }) => {
    const [{ value, error }, setValue] = useFormField<InputDateFieldType>({
        key: fieldKey,
        initialValue,
        label: placeholder,
    });

    const setValueCallback = React.useCallback(
        (event) => {
            const value = event.target.valueAsDate;
            console.log('value', value);
            setValue(value);
        },
        [setValue],
    );

    return (
        <TextFieldMUI
            margin="normal"
            style={{ width: 330, margin: 10 }}
            id={fieldKey}
            type="date"
            label={placeholder}
            error={!!error}
            helperText={error ? error : ''}
            value={value!.toISOString().slice(0, 10)}
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
            onChange={setValueCallback}
        />
    );
};
