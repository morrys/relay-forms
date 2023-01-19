/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// flowlint ambiguous-object-type:error

'use strict';

import { relayRead } from './RelayReader';
import { hasOverlappingIDs, recycleNodesInto } from './RelayStoreUtils';

/*
const RelayFeatureFlags = require('../util/RelayFeatureFlags');
const RelayReader = require('./RelayReader');

const hasOverlappingIDs = require('./hasOverlappingIDs');
const recycleNodesInto = require('../util/recycleNodesInto');*/

export class RelayStoreSubscriptions {
    _subscriptions;

    constructor() {
        this._subscriptions = new Set();
    }

    subscribe(snapshot, callback: (snapshot) => void) {
        const subscription = { backup: null, callback, snapshot, stale: false };
        const dispose = () => {
            this._subscriptions.delete(subscription);
        };
        this._subscriptions.add(subscription);
        return { dispose };
    }

    updateSubscriptions(source, updatedRecordIDs, updatedOwners?) {
        const hasUpdatedRecords = updatedRecordIDs.size !== 0;
        this._subscriptions.forEach((subscription) => {
            const owner = this._updateSubscription(
                source,
                subscription,
                updatedRecordIDs,
                hasUpdatedRecords,
            );
            if (owner != null) {
                updatedOwners.push(owner);
            }
        });
    }

    /**
     * Notifies the callback for the subscription if the data for the associated
     * snapshot has changed.
     * Additionally, updates the subscription snapshot with the latest snapshot,
     * and marks it as not stale.
     * Returns the owner (RequestDescriptor) if the subscription was affected by the
     * latest update, or null if it was not affected.
     */
    _updateSubscription(source, subscription, updatedRecordIDs, hasUpdatedRecords: boolean) {
        const { backup, callback, snapshot, stale } = subscription;
        const hasOverlappingUpdates =
            hasUpdatedRecords && hasOverlappingIDs(snapshot.seenRecords, updatedRecordIDs);
        if (!stale && !hasOverlappingUpdates) {
            return;
        }
        let nextSnapshot =
            hasOverlappingUpdates || !backup ? relayRead(source, snapshot.selector) : backup;
        const nextData = recycleNodesInto(snapshot.data, nextSnapshot.data);
        nextSnapshot = {
            data: nextData,
            isMissingData: nextSnapshot.isMissingData,
            seenRecords: nextSnapshot.seenRecords,
            selector: nextSnapshot.selector,
            missingRequiredFields: nextSnapshot.missingRequiredFields,
        };
        subscription.snapshot = nextSnapshot;
        subscription.stale = false;
        if (nextSnapshot.data !== snapshot.data) {
            callback(nextSnapshot);
            return snapshot.selector.owner;
        }
    }
}
