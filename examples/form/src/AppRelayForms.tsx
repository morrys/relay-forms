import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'relay-hooks';
import { environment } from './environment';
import { Header } from './Header';

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <RelayEnvironmentProvider environment={environment as any}>
                <Header text="relay-forms" />
                <Form />
            </RelayEnvironmentProvider>
        </div>
    );
};

export { useFormField, useForm, useFormState, useFormValue } from 'relay-forms';

export default App;
