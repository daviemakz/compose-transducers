import '@babel/polyfill';
import { Reducer } from 'transducers-js';
import { IIteratorListObject } from './types';
export declare const composeTransducer: (operationList: IIteratorListObject[], mode?: string) => ((src: any[], func: Reducer<any, any>, init: any) => any) | ((source: any[], init?: any[]) => unknown[]);
