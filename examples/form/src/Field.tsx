import * as React from 'react';
import { TextField } from '@material-ui/core';
import { useFormSetValue } from 'relay-forms';
import { useEffect, useCallback } from 'react';
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

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/*
async function validate(value: any) {
    console.log('check forms');
    await sleep(500);
    if (value && value > 100) {
        return 'lunghezza errata ' + value;
    }
    return undefined;
}
*/

function validate(value: any) {
    if (value && value > 100) {
        return 'lunghezza errata ' + value;
    }
    return undefined;
}

export const Field: React.FC<any> = ({ placeholder, fieldKey }) => {
    const [{ error }, setValue] = useFormSetValue({
        key: fieldKey,
        validate,
        initialValue: 1,
    });

    const setValueCallback = useCallback(
        (event) => {
            const value = event.target.value;
            setValue(Number(value));
        },
        [setValue],
    );

    return (
        <>
            {error && <div>{error}</div>}
            <TextField
                defaultValue="1"
                placeholder={placeholder}
                onChange={(value) => setValueCallback(value)}
            />
        </>
    );
};
