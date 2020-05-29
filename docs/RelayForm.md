---
id: relay-form
title: RelayForm
---

This component creates the context of the form in order to recover the relay environment.

It will be deprecated once relay-experimental is officially released

**example**

```tsx
<RelayForm environment={environment}>
    <Form
        onSubmit={promise ? (values) => Promise.resolve(setState(values)) : setState}
    />
    {state && <div>SUBMIT :)</div>}
</RelayForm>

```