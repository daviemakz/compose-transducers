'use strict';

// Polyfill to ensure compatibility
import '@babel/polyfill';

// Import NPM modules
import { comp, filter, into, map, toFn, Reducer } from 'transducers-js';

// Import components
import { functionComposer } from './compose';
import { expectedProps, allowedMethods } from './constants';

// Import types
import { ConvertTransducerMethod, OperationInstance, AllowedOperationsTypes, ComposeTransducer } from './types';

// FUNCTION: Validate iterator list
const validateIteratorList = (expProps: Array<string>) => (operationList: OperationInstance[]) => {
  operationList.forEach(operation => {
    if (expProps.some(prop => !Object.prototype.hasOwnProperty.call(operation, prop))) {
      throw new Error("Each operation must have the shape {type: 'map' | 'filter', funcs: Functions[]}");
    }
  });
  return void 0;
};

// FUNCTION: Validate each operations has an allowed type
const validateOperation = (permittedMethods: Array<string>) => (type: AllowedOperationsTypes) => {
  // Check that the allowed methods exist
  if (!permittedMethods.includes(type)) {
    throw new Error('ConstructError: Unable to build transducer, supported functions are map or filter');
  }
  return void 0;
};

// FUNCTION: Map array functions to transducer-js
const convertTransducerMethod: ConvertTransducerMethod = (type, funcs) => {
  // Validate the operation beforehand
  validateOperation(allowedMethods)(type);
  // Declare method mapping object
  const methodMapping = {
    map: () => map<any, any>(functionComposer(typeof funcs === 'function' ? [funcs] : funcs)),
    filter: () => filter(funcs[0])
  };
  // Return the mapped operation
  return methodMapping[type]();
};

// FUNCTION: Build transducer
export const composeTransducer: ComposeTransducer = (operationList, mode = 'standard') => {
  // Validate operation list
  validateIteratorList(expectedProps)(operationList);
  // Build transformer
  const xf = comp(
    ...operationList
      .reduce(
        (acc: any[], op): OperationInstance[] =>
          op.type === 'map'
            ? acc.concat(op)
            : acc.concat(
                ...op.funcs.map(func => ({
                  type: 'filter',
                  funcs: [func]
                }))
              ),
        []
      )
      .map(({ type, funcs }) => convertTransducerMethod(type, funcs))
  );
  // What type of transducer to return
  return mode === 'reduce'
    ? (src: Array<any>, func: Reducer<any, any>, init: any) => src.reduce(toFn(xf, func), init)
    : (source: Array<any>, init: any = []) => into(init, xf, source);
};
