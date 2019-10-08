'use strict';

// Import types
import { FunctionComposer } from './types';

// FUNCTION: Export the function composer
export const functionComposer: FunctionComposer = fns =>
  fns.reverse().reduce((g, f) => (...args: Array<any>) => g(f(...args)));
