import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from './environment';
import Typography from '@mui/material/Typography/Typography';
import Card from '@mui/material/Card';

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <RelayEnvironmentProvider environment={environment as any}>
                <Card style={{ padding: '20px' }}>
                    <Typography component="h1" variant="h5">
                        react-relay-forms
                    </Typography>
                </Card>
                <Form />
            </RelayEnvironmentProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'react-relay-forms';

export default App;
