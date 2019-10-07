// Allowed transducer methods
export type TAllowedOperations = 'map' | 'filter';

// convertTransducerMethod()
export interface IConvertTransducerMethod {
  (type: TAllowedOperations, func: Function);
}

// Transducer functions
export interface ITransMap<T> {
  (arg: T): T;
}

export interface ITransFilter<T> {
  (arg: T): boolean;
}

export type TTransducerTypes<T> = ITransMap<T> | ITransFilter<T>;

export interface IIteratorListObject {
  type: TAllowedOperations;
  funcs: Array<any> & TTransducerTypes<any>;
}

// functionComposer()
export interface IFunctionComposer {
  (fns: any[]): TTransducerTypes<any>;
}
