import QueryErrorsField from './relay/queryErrorsFieldQuery.graphql';
import QueryField from './relay/queryFieldQuery.graphql';
import { createOperationDescriptor } from './relay/RelayModernOperationDescriptor';
import { getSingularSelector } from './relay/RelayModernSelector';
import { RelayRecordSource } from './relay/RelayRecordSource';
import { RelayStoreUtils } from './relay/RelayStoreUtils';
import { IEnvironment, Snapshot, StoreUpdater } from './relay/RelayTypes';

const { ID_KEY, ROOT_ID } = RelayStoreUtils;

const PREFIX_LOCAL_FORM = 'local:form';

const internalCommitLocalUpdate = (environment: IEnvironment, updater: StoreUpdater): void => {
    environment.commitUpdate((store) => {
        initialCommit(store);
        updater(store);
    });
};

export function getFieldId(key): string {
    return PREFIX_LOCAL_FORM + '.' + key;
}

export function getSnapshot(environment: IEnvironment, fragment: any, key: string): Snapshot {
    const item = {
        __fragmentOwner: operationQueryForm,
        __fragments: { [fragment.name]: {} },
        __id: getFieldId(key),
    };
    return environment.lookup(getSingularSelector(fragment, item));
}

const initialCommit = (store): void => {
    const exists = !!store.get(PREFIX_LOCAL_FORM);
    if (!exists) {
        const localForm = store.create(PREFIX_LOCAL_FORM, 'EntryForm');
        localForm.setLinkedRecords([], 'entries');
        const root = store.get(ROOT_ID) || store.getRoot();
        root.setLinkedRecord(localForm, 'form');
    }
};

export const commitResetIntoRelay = (entries, environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        const form = store.get(PREFIX_LOCAL_FORM);
        form.setValue(false, 'isSubmitting');
        form.setValue(false, 'isValidating');
        entries.forEach((entry) => store.get(getFieldId(entry.key)).setValue('RESET', 'check'));
    });
};

export const commitValidateIntoRelay = (entries, isSubmitting, environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        const form = store.get(PREFIX_LOCAL_FORM);
        form.setValue(isSubmitting, 'isSubmitting');
        form.setValue(true, 'isValidating');
        entries.forEach((entry) => store.get(getFieldId(entry.key)).setValue('START', 'check'));
    });
};

export const commitSubmitEndRelay = (environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        store.get(PREFIX_LOCAL_FORM) &&
            store.get(PREFIX_LOCAL_FORM).setValue(false, 'isSubmitting');
    });
};

export const commitValidateEndRelay = (environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        store.get(PREFIX_LOCAL_FORM) &&
            store.get(PREFIX_LOCAL_FORM).setValue(false, 'isValidating');
    });
};

export const commitResetField = (environment, key): void => {
    const id = getFieldId(key);
    internalCommitLocalUpdate(environment, (store) => {
        const localForm = store.get(PREFIX_LOCAL_FORM);
        const entriesArray = localForm.getLinkedRecords('entries') || [];
        const newEntries = entriesArray.filter((value) => value.getDataID() != id);
        localForm.setLinkedRecords(newEntries, 'entries');
        store.delete(id);
    });
};

export const commitValue = (key, value, check, environment): void => {
    const id = getFieldId(key);
    internalCommitLocalUpdate(environment, (store) => {
        const localForm = store.get(PREFIX_LOCAL_FORM);
        if (!store.get(id)) {
            const root = store.create(id, 'Entry');
            root.setValue(id, 'id');
            root.setValue(key, 'key');
            root.setValue(check, 'check');
            const entriesArray = localForm.getLinkedRecords('entries') || [];
            entriesArray.push(root);
            localForm.setLinkedRecords(entriesArray, 'entries');
        }
    });

    const field = {
        [ID_KEY]: id,
        value,
        check,
        __typename: 'Entry',
    } as any;
    const source = RelayRecordSource.create();
    source.set(id, field);
    environment._publishQueue.commitSource(source);
    environment._publishQueue.run();
};

export const commitErrorIntoRelay = (key, error, environment): void => {
    internalCommitLocalUpdate(environment, (store) => {
        const root = store.get(getFieldId(key));
        root.setValue(error, 'error');
        root.setValue('DONE', 'check');
    });
};

export const operationQueryForm = createOperationDescriptor(QueryField, {});

export const operationQueryErrorsForm = createOperationDescriptor(QueryErrorsField, {});
