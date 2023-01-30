---
id: relay-forms-nodeps
title: relay-forms-nodeps
---

## Installation

Install relay-forms-nodeps using yarn or npm:

```
yarn add relay-forms-nodeps
```

## Create Provider

```ts
import * as React from 'react';
import { useCallback } from 'react';
import { Store, createStore, useFormSubmit, useFormState, useFormSetValue, StoreProvider } from 'relay-forms-nodeps';

export const store: Store = createStore();

export const Form: React.FC = () => {
    const [state, setState] = React.useState(undefined);
    return (
        <StoreProvider store={store}>
            <FormInternal
                onSubmit={setState}
            />
            {state && <div data-testid={'submit-done'}>SUBMIT :)</div>}
        </StoreProvider>
    );
};
```