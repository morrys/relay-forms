/* tslint:disable */
/* eslint-disable */
/* @relayHash ba8e18eb52805d5035b41fd102a40b1b */

import { ConcreteRequest } from 'relay-runtime';
export type queryErrorsFieldQueryVariables = {};
export type queryErrorsFieldQueryResponse = {
    readonly form: {
        readonly isSubmitting: boolean | null;
        readonly isValidating: boolean | null;
        readonly entries: ReadonlyArray<{
            readonly id: string;
            readonly key: string;
            readonly error: string | null;
        } | null> | null;
    } | null;
};
export type queryErrorsFieldQuery = {
    readonly response: queryErrorsFieldQueryResponse;
    readonly variables: queryErrorsFieldQueryVariables;
};

/*
query queryErrorsFieldQuery {
  form {
    isSubmitting
    isValidating
    entries {
      id
      key
      error
    }
  }
}
*/

const node: ConcreteRequest = (function() {
    var v0 = [
        {
            kind: 'LinkedField',
            alias: null,
            name: 'form',
            storageKey: null,
            args: null,
            concreteType: 'EntryForm',
            plural: false,
            selections: [
                {
                    kind: 'ScalarField',
                    alias: null,
                    name: 'isSubmitting',
                    args: null,
                    storageKey: null,
                },
                {
                    kind: 'ScalarField',
                    alias: null,
                    name: 'isValidating',
                    args: null,
                    storageKey: null,
                },
                {
                    kind: 'LinkedField',
                    alias: null,
                    name: 'entries',
                    storageKey: null,
                    args: null,
                    concreteType: 'Entry',
                    plural: true,
                    selections: [
                        {
                            kind: 'ScalarField',
                            alias: null,
                            name: 'id',
                            args: null,
                            storageKey: null,
                        },
                        {
                            kind: 'ScalarField',
                            alias: null,
                            name: 'key',
                            args: null,
                            storageKey: null,
                        },
                        {
                            kind: 'ScalarField',
                            alias: null,
                            name: 'error',
                            args: null,
                            storageKey: null,
                        },
                    ],
                },
            ],
        },
    ];
    return {
        kind: 'Request',
        fragment: {
            kind: 'Fragment',
            name: 'queryErrorsFieldQuery',
            type: 'Query',
            metadata: null,
            argumentDefinitions: [],
            selections: v0 /*: any*/,
        },
        operation: {
            kind: 'Operation',
            name: 'queryErrorsFieldQuery',
            argumentDefinitions: [],
            selections: v0 /*: any*/,
        },
        params: {
            operationKind: 'query',
            name: 'queryErrorsFieldQuery',
            id: null,
            text:
                'query queryErrorsFieldQuery {\n  form {\n    isSubmitting\n    isValidating\n    entries {\n      id\n      key\n      error\n    }\n  }\n}\n',
            metadata: {},
        },
    };
})();
(node as any).hash = '3a7cac5a2c10fdd0c226ef027033689c';
export default node;
