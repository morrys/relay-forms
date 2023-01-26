import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from './environment';
import Typography from '@material-ui/core/Typography/Typography';

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <RelayEnvironmentProvider environment={environment as any}>
                <Typography component="h1" variant="h5">
                    react-relay-forms
                </Typography>
                <Form />
            </RelayEnvironmentProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'react-relay-forms';

export default App;
