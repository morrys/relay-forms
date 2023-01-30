import * as React from 'react';
import { useFormState } from './index';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';

export const FormState: React.FC<any> = () => {
    const { errors, isSubmitting, isValidating } = useFormState();
    const liErrors = errors ? (
        (errors as any[]).map((error) => (
            <Alert key={'alert' + error.key} severity="error">
                {error.label + ': ' + error.error}
            </Alert>
        ))
    ) : (
        <></>
    );
    return (
        <Card>
            {isValidating && <LinearProgress color="secondary" />}
            {isSubmitting && <LinearProgress />}
            <div>{liErrors}</div>
        </Card>
    );
};
