'use strict';

// Polyfill to ensure compatibility
import '@babel/polyfill';

// Import NPM modules
import { comp, filter, into, map, toFn, Reducer } from 'transducers-js';

// Import components
import { functionComposer } from './compose';
import { expectedProps, allowedMethods } from './constants';

// Import types
import { IConvertTransducerMethod, TTransducerTypes, IIteratorListObject } from './types';

// FUNCTION: Validate iterator list
const validateIteratorList = (operationList: IIteratorListObject[]) =>
  operationList.forEach(operation => {
    if (expectedProps.some(prop => !operation.hasOwnProperty(prop))) {
      throw new Error("Each operation must have the shape {type: 'map' | 'filter', funcs: Functions[]}");
    }
  });

// FUNCTION: Map array functions to transducer-js
const convertTransducerMethod: IConvertTransducerMethod = (type, funcs) => {
  // Check that the allowed methods exist
  if (!allowedMethods.includes(type)) {
    throw new Error('ConstructError: Unable to build transducer, supported functions are map or filter');
  }
  // Compose the list of methods for the given operation
  const composedFunctions: TTransducerTypes<any> = functionComposer(typeof funcs === 'function' ? [funcs] : funcs);
  // Declare method mapping object
  const methodMapping = {
    map: () => map<any, any>(composedFunctions),
    filter: () => filter(funcs[0])
  };
  // Return the mapped operation
  return methodMapping[type]();
};

// FUNCTION: Build transducer
export const composeTransducer = (operationList: IIteratorListObject[], mode = 'standard') => {
  // Validate operation list
  validateIteratorList(operationList);
  // Build transformer
  const xf = comp(
    ...operationList
      .reduce((acc: any[], op) => {
        if (op.type === 'map') {
          acc.push(op);
        } else {
          op.funcs.forEach(func => {
            acc.push({
              type: 'filter',
              funcs: [func]
            });
          });
        }
        return acc;
      }, [])
      .map(({ type, funcs }: IIteratorListObject) => convertTransducerMethod(type, funcs))
  );
  // What type of transducer to return
  return mode === 'reduce'
    ? (src: Array<any>, func: Reducer<any, any>, init: any) => src.reduce(toFn(xf, func), init)
    : (source: Array<any>, init = []) => into(init, xf, source);
};
