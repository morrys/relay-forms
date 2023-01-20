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
    subs;

    constructor() {
        this.subs = new Set();
    }

    subscribe(snapshot, callback: (snapshot) => void) {
        const subscription = { callback, snapshot };
        const dispose = () => {
            this.subs.delete(subscription);
        };
        this.subs.add(subscription);
        return { dispose };
    }

    update(source, updatedRecordIDs?) {
        const hasUpdatedRecords = updatedRecordIDs.size !== 0;
        this.subs.forEach((subscription) => {
            this._update(source, subscription, updatedRecordIDs, hasUpdatedRecords);
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
    _update(source, subscription, updatedRecordIDs, hasUpdatedRecords: boolean) {
        const { callback, snapshot } = subscription;
        const hasOverlappingUpdates =
            hasUpdatedRecords && hasOverlappingIDs(snapshot.seenRecords, updatedRecordIDs);
        if (!hasOverlappingUpdates) {
            return;
        }
        let nextSnapshot = relayRead(source, snapshot.selector);
        const nextData = recycleNodesInto(snapshot.data, nextSnapshot.data);
        nextSnapshot = {
            data: nextData,
            seenRecords: nextSnapshot.seenRecords,
            selector: nextSnapshot.selector,
        };
        subscription.snapshot = nextSnapshot;
        if (nextSnapshot.data !== snapshot.data) {
            callback(nextSnapshot);
        }
    }
}
