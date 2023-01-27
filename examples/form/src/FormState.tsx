import * as React from 'react';
import { useFormState } from './index';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';

export const FormState: React.FC<any> = () => {
    const { errors, isSubmitting, isValidating } = useFormState();
    const liErrors = errors ? (
        (errors as any[]).map((error) => (
            <Alert severity="error">{error.label + ': ' + error.error}</Alert>
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
