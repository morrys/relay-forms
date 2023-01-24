---
id: react-relay-forms
title: Getting Started
---

## Installation

Install react-relay-forms and react-relay using yarn or npm:

```
yarn add react-relay-forms react-relay
```

## Create Provider

You need to create a provider only if you want to manage multi-step forms, otherwise the provider you have already created for relay is sufficient

```ts
import * as React from 'react';
import { useCallback } from 'react';
import {
    Environment,
    Network,
    RecordSource,
    Store,
    RequestParameters,
    Variables,
} from 'relay-runtime';
import { RelayEnvironmentProvider } from 'react-relay';

async function fetchQuery(operation: RequestParameters, variables: Variables) {
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    });

    return response.json();
}

export const environment: Environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

export const Form: React.FC = () => {
    const [state, setState] = React.useState(undefined);
    return (
        <RelayEnvironmentProvider environment={environment}>
            <FormInternal
                onSubmit={setState}
            />
            {state && <div data-testid={'submit-done'}>SUBMIT :)</div>}
        </RelayEnvironmentProvider>
    );
};
```