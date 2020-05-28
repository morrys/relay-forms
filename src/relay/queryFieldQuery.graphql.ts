/* tslint:disable */
/* eslint-disable */
/* @relayHash dcfff3d9ea8d483cec6a2916d3f744cc */

import { ConcreteRequest } from 'relay-runtime';
export type queryFieldQueryVariables = {};
export type queryFieldQueryResponse = {
    readonly form: {
        readonly entries: ReadonlyArray<{
            readonly id: string;
            readonly key: string;
            readonly value: string | null;
            readonly check: string | null;
            readonly error: string | null;
        } | null> | null;
    } | null;
};
export type queryFieldQuery = {
    readonly response: queryFieldQueryResponse;
    readonly variables: queryFieldQueryVariables;
};

/*
query queryFieldQuery {
  form {
    entries {
      id
      key
      value
      check
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
                            name: 'value',
                            args: null,
                            storageKey: null,
                        },
                        {
                            kind: 'ScalarField',
                            alias: null,
                            name: 'check',
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
            name: 'queryFieldQuery',
            type: 'Query',
            metadata: null,
            argumentDefinitions: [],
            selections: v0 /*: any*/,
        },
        operation: {
            kind: 'Operation',
            name: 'queryFieldQuery',
            argumentDefinitions: [],
            selections: v0 /*: any*/,
        },
        params: {
            operationKind: 'query',
            name: 'queryFieldQuery',
            id: null,
            text:
                'query queryFieldQuery {\n  form {\n    entries {\n      id\n      key\n      value\n      check\n      error\n    }\n  }\n}\n',
            metadata: {},
        },
    };
})();
(node as any).hash = 'f9fd20a80a839dfb51206c305cbb1657';
export default node;
