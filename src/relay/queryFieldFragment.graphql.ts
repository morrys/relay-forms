/**
 * @generated SignedSource<<d21170d0feb748c6558c5e5dbb4425c4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type queryFieldFragment$data = {
  readonly check: number | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "queryFieldFragment";
};
export type queryFieldFragment$key = {
  readonly " $data"?: queryFieldFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"queryFieldFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "queryFieldFragment",
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
      "name": "check",
      "storageKey": null
    }
  ],
  "type": "Entry",
  "abstractKey": null
};

(node as any).hash = "d5b0953bdeb412925ee13444a6be6082";

export default node;
