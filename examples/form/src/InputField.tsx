import * as React from 'react';
import { TextField as TextFieldMUI } from '@material-ui/core';
import { useFormSetValue } from './index';
import { useCallback } from 'react';
/*
import * as Yup from 'yup';

function fieldValidate(value: any, validate: (value: any) => Promise<any>): Promise<any> {
    return validate(value)
        .then((error) => {
            console.log('value', value);
        })
        .catch((yupError) => {
            if (yupError.name === 'ValidationError') {
                console.log('yupError message', yupError.message);
            }
        });
}
*/

/*
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function validate(value: any) {
    console.log('check forms');
    await sleep(500);
    if (value && value > 100) {
        return 'lunghezza errata ' + value;
    }
    return undefined;
}
*/

export function required(value: string) {
    if (!value || value === 'None') {
        return 'It is required';
    }
    return undefined;
}

export function validateMinFive(value: string) {
    if (value && value.length < 5) {
        return 'Wrong length, minimum 5 current ' + value.length + ' (' + value + ')';
    }
    return undefined;
}

type TextFieldProps = {
    placeholder: string;
    fieldKey: string;
    initialValue?: string;
    validate?: (value: string) => string | undefined;
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
        initialValue,
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
        <>
            <TextFieldMUI
                margin="normal"
                style={{ width: 330, margin: 10 }}
                id={fieldKey}
                label={placeholder}
                autoFocus
                error={!!error}
                helperText={error ? error : ''}
                value={value}
                variant="outlined"
                onChange={setValueCallback}
            />
        </>
    );
};
