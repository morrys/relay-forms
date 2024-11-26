import React from 'react';
import { Form } from './Form';

import { createStore, StoreProvider } from 'relay-forms-nodeps';
import { Header } from './Header';

export const environment = createStore();

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <StoreProvider store={environment as any}>
                <Header text="relay-forms-nodeps" />
                <Form />
            </StoreProvider>
        </div>
    );
};

export { useFormField, useForm, useFormState, useFormValue } from 'relay-forms-nodeps';

export default App;
