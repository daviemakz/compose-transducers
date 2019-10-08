'use strict';

// Import types
import { AllowedOperationsTypes, OperationInstanceKeys } from './types';

// What keys should appear on an instance of an operation
export const expectedProps: OperationInstanceKeys[] = ['type', 'funcs'];

// Permitted string literals for the operation type
export const allowedMethods: AllowedOperationsTypes[] = ['map', 'filter'];
