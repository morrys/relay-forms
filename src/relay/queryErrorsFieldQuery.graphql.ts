/* tslint:disable */
/* eslint-disable */
/* @relayHash 9749f1c8c9c3e858d9542a0ec11bf854 */

import { ConcreteRequest } from "relay-runtime";
export type queryErrorsFieldQueryVariables = {};
export type queryErrorsFieldQueryResponse = {
    readonly form: {
        readonly isSubmitting: boolean | null;
        readonly isValidating: boolean | null;
        readonly entries: ReadonlyArray<{
            readonly id: string;
            readonly key: string;
            readonly error: string | null;
        } | null> | null;
    } | null;
};
export type queryErrorsFieldQuery = {
    readonly response: queryErrorsFieldQueryResponse;
    readonly variables: queryErrorsFieldQueryVariables;
};



/*
query queryErrorsFieldQuery {
  form {
    isSubmitting
    isValidating
    entries {
      id
      key
      error
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
        "kind": "ScalarField",
        "name": "isSubmitting",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isValidating",
        "storageKey": null
      },
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
            "name": "error",
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
    "name": "queryErrorsFieldQuery",
    "selections": (v0/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "queryErrorsFieldQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "9749f1c8c9c3e858d9542a0ec11bf854",
    "metadata": {},
    "name": "queryErrorsFieldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '3a7cac5a2c10fdd0c226ef027033689c';
export default node;
