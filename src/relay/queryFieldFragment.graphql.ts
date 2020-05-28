/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type queryFieldFragment = {
    readonly id: string;
    readonly check: string | null;
    readonly " $refType": "queryFieldFragment";
};
export type queryFieldFragment$data = queryFieldFragment;
export type queryFieldFragment$key = {
    readonly " $data"?: queryFieldFragment$data;
    readonly " $fragmentRefs": FragmentRefs<"queryFieldFragment">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "queryFieldFragment",
  "type": "Entry",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "check",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'd5b0953bdeb412925ee13444a6be6082';
export default node;
