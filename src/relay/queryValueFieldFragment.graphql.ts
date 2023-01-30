/**
 * @generated SignedSource<<a4288a457ec24a515eb4ecc3da813ccc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type queryValueFieldFragment$data = {
  readonly error: string | null;
  readonly id: string;
  readonly label: string | null;
  readonly value: string | null;
  readonly " $fragmentType": "queryValueFieldFragment";
};
export type queryValueFieldFragment$key = {
  readonly " $data"?: queryValueFieldFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"queryValueFieldFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "queryValueFieldFragment",
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
      "name": "value",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "label",
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
  "type": "Entry",
  "abstractKey": null
};

(node as any).hash = "364beea31c4e318a5241f2bd7d96fbd8";

export default node;
