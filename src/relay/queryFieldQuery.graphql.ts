/* tslint:disable */
/* eslint-disable */
/* @relayHash 1bb6a77dff03a4eca0c2a87098a5e25b */

import { ConcreteRequest } from "relay-runtime";
export type queryFieldQueryVariables = {};
export type queryFieldQueryResponse = {
    readonly form: {
        readonly entries: ReadonlyArray<{
            readonly id: string;
            readonly key: string;
            readonly value: string | null;
            readonly check: string | null;
            readonly error: string | null;
            readonly serialize: boolean | null;
        } | null> | null;
    } | null;
};
export type queryFieldQuery = {
    readonly response: queryFieldQueryResponse;
    readonly variables: queryFieldQueryVariables;
};



/*
query queryFieldQuery {
  form {
    entries {
      id
      key
      value
      check
      error
      serialize
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "EntryForm",
    "kind": "LinkedField",
    "name": "form",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Entry",
        "kind": "LinkedField",
        "name": "entries",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "key",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "check",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "error",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "serialize",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "queryFieldQuery",
    "selections": (v0/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "queryFieldQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "1bb6a77dff03a4eca0c2a87098a5e25b",
    "metadata": {},
    "name": "queryFieldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '7f74a3e33f0533abd9ca0c80d7f91b4b';
export default node;
