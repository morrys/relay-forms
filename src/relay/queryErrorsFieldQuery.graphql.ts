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
import { RelayConcreteNode } from './RelayStoreUtils';

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

const queryName = 'queryErrorsFieldQuery';

const node = (function() {
    var v0 = [
        {
            kind: 'LinkedField',
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
                            name: 'error',
                        },
                        {
                            name: 'check',
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
            id: '1',
        },
    };
})();

export default node;
