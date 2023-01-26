import React from 'react';
import { Form } from './Form';

import { createStore, StoreProvider } from 'relay-forms-nodeps';
import Typography from '@material-ui/core/Typography/Typography';

export const environment = createStore();

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <StoreProvider store={environment as any}>
                <Typography component="h1" variant="h5">
                    relay-forms-nodeps
                </Typography>
                <Form />
            </StoreProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'relay-forms-nodeps';

export default App;
