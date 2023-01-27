import { Box, BoxProps, Button, Card, Paper } from '@material-ui/core';
import * as React from 'react';
import { InputField, required, validateMinFive } from './InputField';
import { useFormSubmit, useFormValue } from './index';
import { DropZoneFieldType } from './DropZoneField';
import { InputDateField } from './InputDateField';
import { InputFiles } from './InputFiles';
import { SelectField } from './SelectField';
import MenuItem from '@material-ui/core/MenuItem';
import { FormState } from './FormState';
import { SubmitDone } from './SubmitDone';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SubmitValue {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    uploadables: File[] | undefined;
    state: 'Italy' | 'US';
    birthday: Date;
}

export const Form: React.FC = () => {
    const [state, setState] = React.useState<SubmitValue | undefined>(undefined);
    const onSubmit = React.useCallback(
        (values) => {
            console.log('values', values);
            setState(values);
        },
        [setState],
    );
    return (
        <Paper elevation={5}>
            {!state ? (
                <>
                    <FormInternal onSubmit={onSubmit} />
                    <FormState />
                </>
            ) : (
                <SubmitDone {...state} />
            )}
        </Paper>
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
            sx={{ mt: 1, paddingTop: '15px' }}
        >
            <InputField validate={required} fieldKey="firstName" placeholder="First name" />
            <InputField validate={validateMinFive} fieldKey="lastName" placeholder="Last name" />
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
            <SelectField width={155} placeholder="State" fieldKey="state" initialValue="Unknown">
                <MenuItem key={'Unknown'} value={'Unknown'}>
                    Unknown
                </MenuItem>
                <MenuItem key={'Italy'} value={'Italy'}>
                    Italy
                </MenuItem>
                <MenuItem key={'US'} value={'US'}>
                    US
                </MenuItem>
            </SelectField>
            <InputDateField fieldKey="birthday" placeholder="Birthday" />
            <InputFiles fieldKey="uploadables" />
            <Box
                sx={
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        columnGap: 10,
                        padding: 20,
                    } as any
                }
            >
                <Button variant="contained" color="default" onClick={data.reset}>
                    reset
                </Button>
                <Button variant="contained" color="secondary" onClick={data.validate}>
                    validate
                </Button>
                <Button variant="contained" color="primary" type="submit">
                    submit
                </Button>
            </Box>
        </FormBox>
    );
};
