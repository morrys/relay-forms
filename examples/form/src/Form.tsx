import { Button } from '@material-ui/core';
import * as React from 'react';
import { TextField } from './TextField';
import { useFormSubmit, useFormState, useFormValue } from 'Forms';
import { useEffect } from 'react';
import { DropZoneField, DropZoneFieldType } from './DropZoneField';
import { InputDateField } from './InputDateField';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
}

export const Form: React.FC = () => {
    const [state, setState] = React.useState(undefined);
    const onSubmit = React.useCallback(
        (values) => {
            console.log('values', values);
            setState(values);
        },
        [setState],
    );
    return !state ? (
        <>
            <FormInternal onSubmit={onSubmit} />
            <Errors />
        </>
    ) : (
        <div>SUBMIT :)</div>
    );
};

export const Errors: React.FC<any> = () => {
    const { errors, isValid } = useFormState();
    const liErrors = errors ? (
        (errors as any[]).map((error) => (
            <li key={error.key}>
                {error.key}: {error.error}
            </li>
        ))
    ) : (
        <></>
    );
    return (
        <div>
            <div>{'isValid: ' + isValid}</div>
            <ul>{liErrors}</ul>
        </div>
    );
};

type FormSubmit = {
    firstName: string;
    uploadables: DropZoneFieldType;
    date: Date;
};

export const FormInternal: React.FC<any> = ({ onSubmit }) => {
    const data = useFormSubmit<FormSubmit>({
        onSubmit: (values) => {
            console.log('SUBMIT :)', values);

            onSubmit(values);
        },
    });

    const dataName = useFormValue<string>('firstName');

    return (
        <form onSubmit={data.submit} action="#">
            <div>
                <TextField initialValue="ciao" fieldKey="firstName" placeholder="first name" />
            </div>
            <div>{JSON.stringify(dataName)}</div>
            <div>
                <DropZoneField fieldKey="uploadables" />
            </div>
            <div>
                <InputDateField fieldKey="date" />
            </div>
            <Button onClick={data.reset}>reset</Button>
            <Button onClick={data.validate}>validate</Button>
            <Button type="submit">submit</Button>
        </form>
    );
};
