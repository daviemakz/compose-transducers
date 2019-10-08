// Allowed transducer methods
export type AllowedOperationsTypes = 'map' | 'filter';
export type AllowedTransducerModes = 'standard' | 'reduce';

// convertTransducerMethod()
export interface ConvertTransducerMethod {
  (type: AllowedOperationsTypes, func: Function);
}

// composeTransducer()
export interface ComposeTransducer {
  (operationList: OperationInstance[], mode: AllowedTransducerModes): any;
}

// Transducer functions
export interface TransMap<T> {
  (arg: T): T;
}
export interface TransFilter<T> {
  (arg: T): boolean;
}

export type TransducerTypes<T> = TransMap<T> | TransFilter<T>;

export interface OperationInstance {
  type: AllowedOperationsTypes;
  funcs: Array<any> & TransducerTypes<any>;
}

export type OperationInstanceKeys = keyof OperationInstance;

// functionComposer()
export interface FunctionComposer {
  (fns: any[]): TransducerTypes<any>;
}
