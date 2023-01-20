/**
 * @generated SignedSource<<356236a601c2d5198f4940387cac58ee>>
 * @relayHash 0b493a6f66e132f2693f91a5da941414
 * @lightSyntaxTransform
 * @nogrep
 */

import { LINKED_FIELD } from './RelayStoreUtils';

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
const node = (function() {
    return {
        kind: 'Request',
        id: '0',
        fragment: {
            kind: 'Fragment',
            name: 'queryFieldQuery',
            selections: [
                {
                    kind: LINKED_FIELD,
                    name: 'form',
                    plural: false,
                    selections: [
                        {
                            kind: LINKED_FIELD,
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
            ],
        },
    };
})();

export default node;
