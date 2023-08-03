import { Box, BoxProps, Paper } from '@mui/material';
import * as React from 'react';
import { InputField, required, validateMinFive } from './InputField';
import { DELAY, useFormSubmit } from './index';
import { InputDateField } from './InputDateField';
import { InputFiles } from './InputFiles';
import { SelectField } from './SelectField';
import MenuItem from '@mui/material/MenuItem';
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

//const valu;

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
            {!state ? <FormInternal onSubmit={onSubmit} /> : <SubmitDone {...state} />}
        </Paper>
    );
};

type FormSubmit = {
    firstName: string;
    uploadables: File[];
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

            await sleep(DELAY.submit);
            console.log('SUBMIT DONE :)', values);
            onSubmit(values);
        },
    });

    return (
        <FormBox
            component="form"
            onSubmit={data.submit}
            noValidate
            autoComplete="off"
            sx={{ mt: 1, paddingTop: '15px' }}
        >
            <FormState data={data} />
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

            <FormState data={data} />
        </FormBox>
    );
};
