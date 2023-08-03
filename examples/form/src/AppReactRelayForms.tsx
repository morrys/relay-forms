import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from './environment';
import { Header } from './Header';

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <RelayEnvironmentProvider environment={environment as any}>
                <Header text="react-relay-forms" />
                <Form />
            </RelayEnvironmentProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'react-relay-forms';

export default App;
