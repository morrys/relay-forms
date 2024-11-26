/**
 * @generated SignedSource<<04b54ee15131125215f9f0565846f69f>>
 * @relayHash 1e729a4dd469bbcedf1c07919286ff70
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1e729a4dd469bbcedf1c07919286ff70

import { ConcreteRequest } from 'relay-runtime';
export type queryErrorsFieldQuery$variables = Record<PropertyKey, never>;
export type queryErrorsFieldQuery$data = {
  readonly form: {
    readonly errors: ReadonlyArray<{
      readonly check: number | null | undefined;
      readonly error: string | null | undefined;
      readonly id: string;
      readonly key: string;
      readonly label: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly isSubmitting: boolean | null | undefined;
    readonly isValid: boolean | null | undefined;
    readonly isValidating: boolean | null | undefined;
  } | null | undefined;
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
    "id": "1e729a4dd469bbcedf1c07919286ff70",
    "metadata": {},
    "name": "queryErrorsFieldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "10e337eb009f23b0bbee954d56b68b89";

export default node;
