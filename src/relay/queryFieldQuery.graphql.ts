/**
 * @generated SignedSource<<356236a601c2d5198f4940387cac58ee>>
 * @relayHash 0b493a6f66e132f2693f91a5da941414
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0b493a6f66e132f2693f91a5da941414

export type queryFieldQuery$variables = {};
export type queryFieldQuery$data = {
    readonly form: {
        readonly entries: ReadonlyArray<{
            readonly check: string | null;
            readonly error: string | null;
            readonly id: string;
            readonly key: string;
            readonly value: string | null;
        } | null> | null;
    } | null;
};
export type queryFieldQuery = {
    response: queryFieldQuery$data;
    variables: queryFieldQuery$variables;
};

const queryName = 'queryFieldQuery';

const node = (function() {
    var v0 = [
        {
            kind: 'LinkedField',
            name: 'form',
            plural: false,
            selections: [
                {
                    kind: 'LinkedField',
                    name: 'entries',
                    plural: true,
                    selections: [
                        {
                            name: 'id',
                        },
                        {
                            name: 'key',
                        },
                        {
                            name: 'value',
                        },
                        {
                            name: 'check',
                        },
                        {
                            name: 'error',
                        },
                    ],
                },
            ],
        },
    ];
    return {
        fragment: {
            kind: 'Fragment',
            name: queryName,
            selections: v0 /*: any*/,
            type: 'Query',
        },
        kind: 'Request',
        operation: {
            kind: 'Operation',
            name: queryName,
            selections: v0 /*: any*/,
        },
        params: {
            id: '0',
        },
    };
})();

export default node;
