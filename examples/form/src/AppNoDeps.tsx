import React from 'react';
import { Form } from './Form';

import { createStore, StoreProvider } from 'relay-forms-nodeps';
import Typography from '@material-ui/core/Typography/Typography';
import Card from '@material-ui/core/Card';

export const environment = createStore();

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <StoreProvider store={environment as any}>
                <Card style={{ padding: '20px' }}>
                    <Typography component="h1" variant="h5">
                        relay-forms-nodeps
                    </Typography>
                </Card>
                <Form />
            </StoreProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'relay-forms-nodeps';

export default App;
