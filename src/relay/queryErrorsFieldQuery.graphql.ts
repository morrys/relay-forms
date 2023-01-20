/**
 * @generated SignedSource<<314f1ee8f760d64499cd346f84a8cca6>>
 * @relayHash bcada931a45af33846035fd01b1513e8
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID bcada931a45af33846035fd01b1513e8

import { LINKED_FIELD } from './RelayStoreUtils';

export type queryErrorsFieldQuery$variables = {};
export type queryErrorsFieldQuery$data = {
    readonly form: {
        readonly entries: ReadonlyArray<{
            readonly check: string | null;
            readonly error: string | null;
            readonly id: string;
            readonly key: string;
        } | null> | null;
        readonly isSubmitting: boolean | null;
        readonly isValidating: boolean | null;
    } | null;
};
export type queryErrorsFieldQuery = {
    response: queryErrorsFieldQuery$data;
    variables: queryErrorsFieldQuery$variables;
};

const node = (function() {
    return {
        kind: 'Request',
        id: '1',
        fragment: {
            kind: 'Fragment',
            name: 'queryErrorsFieldQuery',
            selections: [
                {
                    kind: LINKED_FIELD,
                    name: 'form',
                    plural: false,
                    selections: [
                        {
                            name: 'isSubmitting',
                        },
                        {
                            name: 'isValidating',
                        },
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
                                    name: 'error',
                                },
                                {
                                    name: 'check',
                                },
                            ],
                        },
                    ],
                },
            ] /*: any*/,
        },
    };
})();

export default node;
