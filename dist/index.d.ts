import '@babel/polyfill';
import { Reducer } from 'transducers-js';
import { OperationInstance } from './types';
export declare const composeTransducer: (operationList: OperationInstance[], mode?: string) => ((src: any[], func: Reducer<any, any>, init: any) => any) | ((source: any[], init?: any[]) => unknown[]);
