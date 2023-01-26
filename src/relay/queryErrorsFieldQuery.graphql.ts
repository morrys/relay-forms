/**
 * @generated SignedSource<<a017ebeb9b4e3ee486d8b615b5630b0d>>
 * @relayHash e17d5714b14e220ee2b4de1416219521
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e17d5714b14e220ee2b4de1416219521

import { ConcreteRequest, Query } from 'relay-runtime';
export type queryErrorsFieldQuery$variables = {};
export type queryErrorsFieldQuery$data = {
  readonly form: {
    readonly entries: ReadonlyArray<{
      readonly check: number | null;
      readonly error: string | null;
      readonly id: string;
      readonly key: string;
      readonly label: string | null;
    } | null> | null;
    readonly isSubmitting: boolean | null;
    readonly isValidating: boolean | null;
  } | null;
};
export type queryErrorsFieldQuery = {
  response: queryErrorsFieldQuery$data;
  variables: queryErrorsFieldQuery$variables;
};

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
            "name": "label",
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "queryErrorsFieldQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "e17d5714b14e220ee2b4de1416219521",
    "metadata": {},
    "name": "queryErrorsFieldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "25d1fe8f7932883a819499ca3bbc88e6";

export default node;
