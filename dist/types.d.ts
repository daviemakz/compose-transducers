export declare type TAllowedOperations = 'map' | 'filter';
export interface IConvertTransducerMethod {
    (type: TAllowedOperations, func: Function): any;
}
export interface ITransMap<T> {
    (arg: T): T;
}
export interface ITransFilter<T> {
    (arg: T): boolean;
}
export declare type TTransducerTypes<T> = ITransMap<T> | ITransFilter<T>;
export interface IIteratorListObject {
    type: TAllowedOperations;
    funcs: Array<any> & TTransducerTypes<any>;
}
export interface IFunctionComposer {
    (fns: any[]): TTransducerTypes<any>;
}
