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

const PREFIX_LOCAL_FORM = 'local:form';

type FormStoreUpdater = (store: RecordSourceProxy, form: RecordProxy) => void;

export function getFieldId(key): string {
    return PREFIX_LOCAL_FORM + '.' + key;
}

export function getSnapshot(
    environment: IEnvironment,
    fragment: ReaderFragment,
    key: string,
): Snapshot {
    const item = {
        __fragmentOwner: operationQueryForm.request,
        __fragments: { [fragment.name]: {} },
        __id: getFieldId(key),
    };
    return environment.lookup(getSingularSelector(fragment, item));
}

export function commit(environment: IEnvironment, updater: FormStoreUpdater): void {
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
}

export const operationQueryForm = createOperationDescriptor(QueryField, {});

export const operationQueryErrorsForm = createOperationDescriptor(QueryErrorsField, {});
