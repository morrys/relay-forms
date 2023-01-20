/**
 * @generated SignedSource<<456873a8a73fd6689487d051ab6998f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

export type queryValueFieldFragment$data = {
    readonly error: string | null;
    readonly id: string;
    readonly value: string | null;
    readonly ' $fragmentType': 'queryValueFieldFragment';
};
export type queryValueFieldFragment$key = {
    readonly ' $data'?: queryValueFieldFragment$data;
    readonly ' $fragmentSpreads';
};

const node = {
    kind: 'Fragment',
    name: 'queryValueFieldFragment',
    selections: [
        {
            name: 'id',
        },
        {
            name: 'value',
        },
        {
            name: 'error',
        },
    ],
    type: 'Entry',
};

export default node;
