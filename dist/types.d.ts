export declare type AllowedOperationsTypes = 'map' | 'filter';
export interface ConvertTransducerMethod {
    (type: AllowedOperationsTypes, func: Function): any;
}
export interface TransMap<T> {
    (arg: T): T;
}
export interface TransFilter<T> {
    (arg: T): boolean;
}
export declare type TransducerTypes<T> = TransMap<T> | TransFilter<T>;
export interface OperationInstance {
    type: AllowedOperationsTypes;
    funcs: Array<any> & TransducerTypes<any>;
}
export declare type OperationInstanceKeys = keyof OperationInstance;
export interface FunctionComposer {
    (fns: any[]): TransducerTypes<any>;
}
