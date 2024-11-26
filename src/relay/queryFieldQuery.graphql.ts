/**
 * @generated SignedSource<<c9367a7ad3003d4d7ecabfe82558401b>>
 * @relayHash 0b493a6f66e132f2693f91a5da941414
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0b493a6f66e132f2693f91a5da941414

import { ConcreteRequest } from 'relay-runtime';
export type queryFieldQuery$variables = Record<PropertyKey, never>;
export type queryFieldQuery$data = {
  readonly form: {
    readonly entries: ReadonlyArray<{
      readonly check: number | null | undefined;
      readonly error: string | null | undefined;
      readonly id: string;
      readonly key: string;
      readonly value: string | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type queryFieldQuery = {
  response: queryFieldQuery$data;
  variables: queryFieldQuery$variables;
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "queryFieldQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "0b493a6f66e132f2693f91a5da941414",
    "metadata": {},
    "name": "queryFieldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "f9fd20a80a839dfb51206c305cbb1657";

export default node;
