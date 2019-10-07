'use strict';

// Import types
import { IFunctionComposer } from './types';

// Export the function composer
export const functionComposer: IFunctionComposer = fns =>
  fns.reverse().reduce((g, f) => (...args: Array<any>) => g(f(...args)));
