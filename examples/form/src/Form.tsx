import { Box, BoxProps, Button } from '@material-ui/core';
import * as React from 'react';
import { InputField, required, validateMinFive } from './InputField';
import { useFormSubmit, useFormValue } from './index';
import { DropZoneFieldType } from './DropZoneField';
import { InputDateField } from './InputDateField';
import { InputFiles } from './InputFiles';
import { SelectField } from './SelectField';
import MenuItem from '@material-ui/core/MenuItem';
import { FormState } from './FormState';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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
            <FormState />
        </>
    ) : (
        <div>SUBMIT :)</div>
    );
};

type FormSubmit = {
    firstName: string;
    uploadables: DropZoneFieldType;
    date: Date;
    gender: 'M' | 'F';
};

type FormBoxProps = BoxProps & React.FormHTMLAttributes<HTMLFormElement>;

export const FormBox: React.FunctionComponent<FormBoxProps> = (props) => (
    <Box {...props} component="form" />
);

export const FormInternal: React.FC<any> = ({ onSubmit }) => {
    const data = useFormSubmit<FormSubmit>({
        onSubmit: async (values) => {
            console.log('SUBMIT :)', values);

            await sleep(3000);
            console.log('SUBMIT DONE :)', values);
            onSubmit(values);
        },
    });

    const dataName = useFormValue<string>('firstName');

    return (
        <FormBox
            component="form"
            onSubmit={data.submit}
            noValidate
            autoComplete="off"
            sx={{ mt: 1 }}
        >
            <InputField
                validate={required}
                initialValue="Lorenzo"
                fieldKey="firstName"
                placeholder="First name"
            />
            <InputField
                validate={validateMinFive}
                initialValue="Di Giacomo"
                fieldKey="lastName"
                placeholder="Last name"
            />
            <SelectField width={155} placeholder="Gender" validate={required} fieldKey="gender">
                <MenuItem key={'None'} value={'None'}>
                    None
                </MenuItem>
                <MenuItem key={'M'} value={'M'}>
                    Male
                </MenuItem>
                <MenuItem key={'F'} value={'F'}>
                    Female
                </MenuItem>
            </SelectField>
            <SelectField width={155} placeholder="State" fieldKey="state">
                <MenuItem key={'None'} value={'None'}>
                    None
                </MenuItem>
                <MenuItem key={'Italy'} value={'Italy'}>
                    Italy
                </MenuItem>
                <MenuItem key={'US'} value={'US'}>
                    US
                </MenuItem>
            </SelectField>
            <InputDateField fieldKey="date" placeholder="Birthday" />
            <InputFiles fieldKey="uploadables" />
            <Box
                sx={
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        columnGap: 10,
                        margin: 10,
                    } as any
                }
            >
                <Button variant="contained" color="primary" onClick={data.reset}>
                    reset
                </Button>
                <Button variant="contained" color="primary" onClick={data.validate}>
                    validate
                </Button>
                <Button variant="contained" color="primary" type="submit">
                    submit
                </Button>
            </Box>
        </FormBox>
    );
};
