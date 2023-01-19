import { RelayRecordState } from './RelayStoreUtils';

export type Disposable = { dispose(): void };

// Variables
export type Variables = { [key: string]: any };

export interface RecordProxy {
    copyFieldsFrom(source: RecordProxy): void;
    getDataID(): string;
    getLinkedRecord(name: string, args?: Variables): RecordProxy | null | undefined;
    getLinkedRecords(
        name: string,
        args?: Variables,
    ): Array<RecordProxy | null | undefined> | null | undefined;
    getOrCreateLinkedRecord(name: string, typeName: string, args?: Variables): RecordProxy;
    getType(): string;
    getValue(name: string, args?: Variables): any;
    setLinkedRecord(record: RecordProxy, name: string, args?: Variables): RecordProxy;
    setLinkedRecords(records: Array<RecordProxy>, name: string, args?: Variables): RecordProxy;
    setValue(value: any, name: string, args?: Variables): RecordProxy;
}

export interface RecordSourceProxy {
    create(string: string, typeName: string): RecordProxy;
    delete(string: string): void;
    get(string: string): RecordProxy | null | undefined;
    getRoot(): RecordProxy;
}

export type StoreUpdater = (store: RecordSourceProxy) => void;

export type Record = { [key: string]: any };

export type SelectorData = { [key: string]: any };

export type RecordState = keyof typeof RelayRecordState;

export interface RecordSource {
    get(dataID: string): Record | null | undefined;
    getRecordIDs(): Array<string>;
    getStatus(dataID: string): RecordState;
    has(dataID: string): boolean;
    size(): number;
    toJSON(): { [key: string]: Record | null | undefined };
}

export type Snapshot = {
    data: SelectorData | null | undefined;
    isMissingData: boolean;
    seenRecords: Set<string>;
    selector: any;
    missingRequiredFields: any;
};

export type OperationDescriptor = {
    fragment: any;
    request: any;
    root: any;
};

export interface Store {
    /**
     * Get a read-only view of the store's internal RecordSource.
     */
    getSource(): RecordSource;

    /**
     * Read the results of a selector from in-memory records in the store.
     */
    lookup(selector: any): Snapshot;

    /**
     * Notify subscribers (see `subscribe`) of any data that was published
     * (`publish()`) since the last time `notify` was called.
     * Optionally provide an OperationDescriptor indicating the source operation
     * that was being processed to produce this run.
     *
     * This method should return an array of the affected fragment owners.
     */
    notify(sourceOperation?: OperationDescriptor, invalidateStore?: boolean): ReadonlyArray<any>;

    /**
     * Publish new information (e.g. from the network) to the store, updating its
     * internal record source. Subscribers are not immediately notified - this
     * occurs when `notify()` is called.
     */
    publish(source: RecordSource): void;

    /**
     * Ensure that all the records necessary to fulfill the given selector are
     * retained in memory. The records will not be eligible for garbage collection
     * until the returned reference is disposed.
     */
    retain(operation: OperationDescriptor): Disposable;

    /**
     * Subscribe to changes to the results of a selector. The callback is called
     * when `notify()` is called *and* records have been published that affect the
     * selector results relative to the last `notify()`.
     */
    subscribe(snapshot: Snapshot, callback: (snapshot: Snapshot) => void): Disposable;
}

export interface MutableRecordSource extends RecordSource {
    clear(): void;
    delete(dataID: string): void;
    remove(dataID: string): void;
    set(dataID: string, record: Record): void;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IEnvironment {
    /**
     * Subscribe to changes to the results of a selector. The callback is called
     * when data has been committed to the store that would cause the results of
     * the snapshot's selector to change.
     */
    subscribe(snapshot: Snapshot, callback: (snapshot: Snapshot) => void): Disposable;

    /**
     * Ensure that all the records necessary to fulfill the given selector are
     * retained in-memory. The records will not be eligible for garbage collection
     * until the returned reference is disposed.
     */
    retain(operation: OperationDescriptor): Disposable;

    /**
     * Commit an updater to the environment. This mutation cannot be reverted and
     * should therefore not be used for optimistic updates. This is mainly
     * intended for updating fields from client schema extensions.
     */
    commitUpdate(updater: StoreUpdater): void;
    /**
     * Get the environment's internal Store.
     */
    getStore(): Store;

    /**
     * Read the results of a selector from in-memory records in the store.
     */
    lookup(selector: any): Snapshot;
}
