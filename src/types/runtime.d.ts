/* eslint-disable @typescript-eslint/no-unused-vars */
import * as runtime from 'relay-runtime';
declare module 'relay-runtime' {
    export const isPromise: (value: any) => boolean;
}
