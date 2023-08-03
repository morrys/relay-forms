/**
 * @generated SignedSource<<5a0e2c9c0f979fb24973c3cb36a508ca>>
 * @relayHash 1e729a4dd469bbcedf1c07919286ff70
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1e729a4dd469bbcedf1c07919286ff70

import { ConcreteRequest, Query } from 'relay-runtime';
export type queryErrorsFieldQuery$variables = {};
export type queryErrorsFieldQuery$data = {
  readonly form: {
    readonly errors: ReadonlyArray<{
      readonly check: number | null;
      readonly error: string | null;
      readonly id: string;
      readonly key: string;
      readonly label: string | null;
    } | null> | null;
    readonly isSubmitting: boolean | null;
    readonly isValid: boolean | null;
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
        "kind": "ScalarField",
        "name": "isValid",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Entry",
        "kind": "LinkedField",
        "name": "errors",
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
    "id": "1e729a4dd469bbcedf1c07919286ff70\r",
    "metadata": {},
    "name": "queryErrorsFieldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "10e337eb009f23b0bbee954d56b68b89";

export default node;
