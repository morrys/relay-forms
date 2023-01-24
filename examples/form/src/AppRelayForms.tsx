import React from 'react';
import { Form } from './Form';

import { RelayEnvironmentProvider } from 'relay-hooks';
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

export default App;
