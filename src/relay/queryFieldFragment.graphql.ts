/**
 * @generated SignedSource<<accbd64eaae9149aaaa7cd059e6804a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

export type queryFieldFragment$data = {
    readonly check: string | null;
    readonly id: string;
    readonly ' $fragmentType': 'queryFieldFragment';
};
export type queryFieldFragment$key = {
    readonly ' $data'?: queryFieldFragment$data;
    readonly ' $fragmentSpreads';
};

const node = {
    kind: 'Fragment',
    name: 'queryFieldFragment',
    selections: [
        {
            name: 'id',
        },
        {
            name: 'check',
        },
    ],
    type: 'Entry',
};

export default node;
