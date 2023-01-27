import {
    createOperationDescriptor,
    IEnvironment,
    getSingularSelector,
    ReaderFragment,
    Snapshot,
    RecordProxy,
    RecordSourceProxy,
} from 'relay-runtime';
import QueryErrorsField from './relay/queryErrorsFieldQuery.graphql';
import QueryField from './relay/queryFieldQuery.graphql';
import { DONEVALIDATED, RESET, TOBEVALIDATE, VALIDATING } from './useFormSetValue';

const PREFIX_LOCAL_FORM = 'local:form';

type FormStoreUpdater = (store: RecordSourceProxy, form: RecordProxy) => void;

const internalCommitLocalUpdate = (environment: IEnvironment, updater: FormStoreUpdater): void => {
    environment.commitUpdate((store) => {
        let localForm = store.get(PREFIX_LOCAL_FORM);
        if (!localForm) {
            localForm = store
                .create(PREFIX_LOCAL_FORM, 'EntryForm')
                .setLinkedRecords([], 'entries')
                .setLinkedRecords([], 'errors');
            store.getRoot().setLinkedRecord(localForm, 'form');
        }
        updater(store, localForm);
    });
};

function getFieldId(key): string {
    return PREFIX_LOCAL_FORM + '.' + key;
}

export function getSnapshot(
    environment: IEnvironment,
    fragment: ReaderFragment,
    key: string,
): Snapshot {
    const item = {
        __fragmentOwner: operationQueryForm,
        __fragments: { [fragment.name]: {} },
        __id: getFieldId(key),
    };
    return environment.lookup(getSingularSelector(fragment, item));
}

export const commitResetIntoRelay = (environment): void => {
    internalCommitLocalUpdate(environment, (_, form) => {
        form.setValue(false, 'isSubmitting')
            .setValue(false, 'isValidating')
            .setLinkedRecords([], 'errors')
            .getLinkedRecords('entries')
            .forEach((entry: any) => entry.setValue(RESET, 'check').setValue(undefined, 'error'));
    });
};

export const commitValidateIntoRelay = (environment, isSubmitting: boolean): void => {
    internalCommitLocalUpdate(environment, (_, form) => {
        const tobeValitating = form
            .setValue(isSubmitting, 'isSubmitting')
            .getLinkedRecords('entries')
            .filter((value: any) => value.getValue('check') === TOBEVALIDATE);
        form.setValue(tobeValitating.length === 0, 'isValidating');
        tobeValitating.forEach((entry: any) => entry.setValue(VALIDATING, 'check'));
    });
};

export const commitSubmitEndRelay = (environment): void => {
    internalCommitLocalUpdate(environment, (_, form) => {
        form.setValue(false, 'isSubmitting');
    });
};

export const commitStateRelay = (environment, isValidating, isValid, errors): void => {
    internalCommitLocalUpdate(environment, (store, form) => {
        form.setValue(isValidating, 'isValidating').setValue(isValid, 'isValid');
        const errorFields = [];
        errors.forEach((id) => {
            errorFields.push(store.get(id));
        });
        form.setLinkedRecords(errorFields, 'errors');
    });
};

export const commitResetField = (environment, key): void => {
    const id = getFieldId(key);
    internalCommitLocalUpdate(environment, (store, form) => {
        const entriesArray = form.getLinkedRecords('entries');
        const newEntries = entriesArray.filter((value) => value.getDataID() != id);
        form.setLinkedRecords(newEntries, 'entries');
        store.delete(id);
    });
};

export const commitValue = (key, label, value, check, environment): void => {
    const id = getFieldId(key);
    internalCommitLocalUpdate(environment, (store, form) => {
        let field: any = store.get(id);
        if (!field) {
            field = store.create(id, 'Entry');
            /*field
                .setValue(id, 'id')
                .setValue(key, 'key')
                .setValue(check, 'check');*/

            const entriesArray = form.getLinkedRecords('entries');
            entriesArray.push(field);
            form.setLinkedRecords(entriesArray, 'entries');
        }
        if (check === VALIDATING) {
            form.setValue(true, 'isValidating');
        }
        field
            .setValue(id, 'id')
            .setValue(label, 'label')
            .setValue(key, 'key')
            .setValue(check, 'check')
            .setValue(undefined, 'error')
            .setValue__UNSAFE(value, 'value');
    });

    /*const field = {
        [ID_KEY]: id,
        value,
        check,
        __typename: 'Entry',
    } as any;
    const source = new RecordSource();
    source.set(id, field);
    environment._publishQueue.commitSource(source);
    environment._publishQueue.run();*/
};

export const commitErrorIntoRelay = (key, error, environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        store
            .get(getFieldId(key))
            .setValue(error, 'error')
            .setValue(DONEVALIDATED, 'check');
    });
};

export const operationQueryForm = createOperationDescriptor(QueryField, {});

export const operationQueryErrorsForm = createOperationDescriptor(QueryErrorsField, {});
