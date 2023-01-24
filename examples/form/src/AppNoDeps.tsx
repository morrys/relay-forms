import React from 'react';
import { Form } from './Form';

import { createStore, StoreProvider } from 'relay-forms-nodeps';

export const environment = createStore();

const App = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <StoreProvider store={environment as any}>
                <Form />
            </StoreProvider>
        </div>
    );
};

export default App;
