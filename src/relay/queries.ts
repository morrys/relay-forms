import { LINKED_FIELD } from './RelayStoreUtils';

const id = {
    name: 'id',
};

const key = {
    name: 'key',
};

const check = {
    name: 'check',
};

const error = {
    name: 'error',
};

const value = {
    name: 'value',
};

const label = {
    name: 'label',
};

const kindFragment = 'Fragment';

export declare type QueryErrorsData = {
    readonly form: {
        readonly errors: ReadonlyArray<{
            readonly check: number | null;
            readonly error: string | null;
            readonly id: string;
            readonly key: string;
            readonly label: string | null;
        } | null> | null;
        readonly isSubmitting: boolean | null;
        readonly isValid: boolean | null;
        readonly isValidating: boolean | null;
    } | null;
};

export const QueryErrors = {
    id: '1',
    fragment: {
        kind: kindFragment,
        name: 'queryErrors',
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
                        name: 'errors',
                        plural: true,
                        selections: [id, key, error, check, label],
                    },
                ],
            },
        ] /*: any*/,
    },
};

export declare type QueryFieldsData = {
    readonly form: {
        readonly entries: ReadonlyArray<{
            readonly check: number | null;
            readonly error: string | null;
            readonly id: string;
            readonly key: string;
            readonly value: string | null;
        } | null> | null;
    } | null;
};

export const QueryFields = {
    id: '0',
    fragment: {
        kind: kindFragment,
        name: 'queryFields',
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
                        selections: [id, key, value, error, check],
                    },
                ],
            },
        ],
    },
};

export declare type FragmentSetData = {
    readonly check: number | null;
    readonly id: string;
};

export const FragmentSet = {
    kind: kindFragment,
    name: 'fragmentSet',
    selections: [id, check],
};

export const FragmentValue = {
    kind: kindFragment,
    name: 'fragmentValue',
    selections: [id, value, error, label],
};
