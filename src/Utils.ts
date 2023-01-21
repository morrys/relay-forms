import { QueryErrors, QueryFields } from './relay/queries';
import { getSingularSelector, createOperationDescriptor } from './relay/RelayModernSelector';
import { Store, RecordSourceProxy, Snapshot, RecordProxy } from './relay/RelayTypes';

const PREFIX_LOCAL_FORM = 'local:form';

type FormStoreUpdater = (store: RecordSourceProxy, form: RecordProxy) => void;

const internalCommitLocalUpdate = (environment: Store, updater: FormStoreUpdater): void => {
    environment.commitUpdate((store) => {
        let localForm = store.get(PREFIX_LOCAL_FORM);
        if (!localForm) {
            localForm = store.create(PREFIX_LOCAL_FORM).setLinkedRecords([], 'entries');
            store.getRoot().setLinkedRecord(localForm, 'form');
        }
        updater(store, localForm);
    });
};

function getFieldId(key): string {
    return PREFIX_LOCAL_FORM + '.' + key;
}

export function getSnapshot(environment: Store, fragment: any, key: string): Snapshot {
    const item = {
        __id: getFieldId(key),
    };
    return environment.lookup(getSingularSelector(fragment, item));
}

export const commitResetIntoRelay = (entries, environment): void => {
    internalCommitLocalUpdate(environment, (store, form) => {
        form.setValue(false, 'isSubmitting');
        form.setValue(false, 'isValidating');
        entries.forEach((entry) => store.get(getFieldId(entry.key)).setValue('RESET', 'check'));
    });
};

export const commitValidateIntoRelay = (entries, isSubmitting, environment): void => {
    internalCommitLocalUpdate(environment, (store, form) => {
        form.setValue(isSubmitting, 'isSubmitting');
        form.setValue(true, 'isValidating');
        entries.forEach((entry) => store.get(getFieldId(entry.key)).setValue('START', 'check'));
    });
};

export const commitSubmitEndRelay = (environment): void => {
    internalCommitLocalUpdate(environment, (_, form) => {
        form.setValue(false, 'isSubmitting');
    });
};

export const commitValidateEndRelay = (environment): void => {
    internalCommitLocalUpdate(environment, (_, form) => {
        form.setValue(false, 'isValidating');
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

export const commitValue = (key, value, check, environment): void => {
    const id = getFieldId(key);
    internalCommitLocalUpdate(environment, (store, form) => {
        let field = store.get(id);
        if (!field) {
            field = store.create(id);
            const entriesArray = form.getLinkedRecords('entries');
            entriesArray.push(field);
            form.setLinkedRecords(entriesArray, 'entries');
        }
        field
            .setValue(id, 'id')
            .setValue(key, 'key')
            .setValue(check, 'check')
            .setValue(value, 'value');
    });
};

export const commitErrorIntoRelay = (key, error, environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        store
            .get(getFieldId(key))
            .setValue(error, 'error')
            .setValue('DONE', 'check');
    });
};

export const operationQueryForm = createOperationDescriptor(QueryFields);

export const operationQueryErrorsForm = createOperationDescriptor(QueryErrors);
