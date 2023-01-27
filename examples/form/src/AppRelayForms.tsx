import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'relay-hooks';
import { environment } from './environment';
import Typography from '@material-ui/core/Typography/Typography';
import { Card } from '@material-ui/core';

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <RelayEnvironmentProvider environment={environment as any}>
                <Card style={{ padding: '20px' }}>
                    <Typography component="h1" variant="h5">
                        relay-forms
                    </Typography>
                </Card>
                <Form />
            </RelayEnvironmentProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'relay-forms';

export default App;
