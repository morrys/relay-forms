import { QueryErrors, QueryFields } from './relay/queries';
import { createOperationDescriptor, getSingularSelector } from './relay/RelayModernSelector';
import { RecordProxy, RecordSourceProxy, Snapshot, Store } from './relay/RelayTypes';

const PREFIX_LOCAL_FORM = 'local:form';

type FormStoreUpdater = (store: RecordSourceProxy, form: RecordProxy) => void;

export function getFieldId(key): string {
    return PREFIX_LOCAL_FORM + '.' + key;
}

export function getSnapshot(environment: Store, fragment: any, key: string): Snapshot {
    const item = {
        __id: getFieldId(key),
    };
    return environment.lookup(getSingularSelector(fragment, item));
}

export function commit(environment: Store, updater: FormStoreUpdater): void {
    environment.commitUpdate((store) => {
        let localForm = store.get(PREFIX_LOCAL_FORM);
        if (!localForm) {
            localForm = store
                .create(PREFIX_LOCAL_FORM)
                .setLinkedRecords([], 'entries')
                .setLinkedRecords([], 'errors');
            store.getRoot().setLinkedRecord(localForm, 'form');
        }
        updater(store, localForm);
    });
}

export const operationQueryForm = createOperationDescriptor(QueryFields);

export const operationQueryErrorsForm = createOperationDescriptor(QueryErrors);
