---
id: relay-forms-nodeps
title: Getting Started
---

## Installation

Install relay-forms-nodeps using yarn or npm:

```
yarn add relay-forms-nodeps
```

## Contributing

* **Give a star** to the repository and **share it**, you will **help** the **project** and the **people** who will find it useful

* **Create issues**, your **questions** are a **valuable help**

* **PRs are welcome**, but it is always **better to open the issue first** so as to **help** me and other people **evaluating it**

* **Please sponsor me**

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