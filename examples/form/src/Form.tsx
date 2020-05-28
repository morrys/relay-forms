import { Button } from '@material-ui/core';
import * as React from 'react';
import { Field } from './Field';
import { RelayForm, useFormSubmit, useFormState } from 'relay-forms';
import { environment } from './relay';
import { useEffect } from 'react';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
}

interface Props {
    onSubmit: (values: any) => void;
}

export const Form: React.FC<Props> = ({ onSubmit }) => {
    const [state, setState] = React.useState(undefined);
    useEffect(() => {
        console.log(
            'evn',
            environment
                .getStore()
                .getSource()
                .toJSON(),
        );
    });
    return !state ? (
        <RelayForm environment={environment}>
            <FormInternal onSubmit={setState} />
        </RelayForm>
    ) : (
        <div>SUBMIT :)</div>
    );
};

export const Errors: React.FC<any> = () => {
    const { errors } = useFormState();
    return <div>{errors ? 'have errors' : ''}</div>;
};

type FormSubmit = {
    firstName: number;
    lastName: number;
    email: number;
};

export const FormInternal: React.FC<any> = ({ onSubmit }) => {
    const data = useFormSubmit<FormSubmit>({
        onSubmit: (values) => {
            console.log('SUBMIT :)', values);

            onSubmit(values);
        },
    });

    return (
        <form onSubmit={data.submit} action="#">
            <div>
                <Field fieldKey="firstName" placeholder="first name" />
            </div>
            <div>
                <Field fieldKey="lastName" placeholder="last name" />
            </div>
            <div>
                <Field fieldKey="email" placeholder="email" />
            </div>
            <Errors />
            <Button type="submit">submit</Button>
        </form>
    );
};
