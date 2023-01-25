import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from './environment';

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <RelayEnvironmentProvider environment={environment as any}>
                <Form />
            </RelayEnvironmentProvider>
        </div>
    );
};

export { useFormSetValue, useFormSubmit, useFormState, useFormValue } from 'react-relay-forms';

export default App;
