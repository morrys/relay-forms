import * as React from 'react';
import { useFormState } from './index';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';

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
        <div>
            {isValidating && <LinearProgress />}
            {isSubmitting && <LinearProgress color="secondary" />}
            <div>{liErrors}</div>
        </div>
    );
};
