'use strict';

// Import NPM modules
import { composeTransducer } from './../../dist';

// Define my operations
const addTwo = number => number + 2;
const multiplyByTen = number => number * 10;
const divideByThree = number => number / 3;
const filterLessThanTen = number => number > 10;
const filterLessThanOFourteen = number => number > 14;
const addAllNumbers = (total, number) => total + number;

// Define example 'input'
const input = [1, 2, 3, 4, 5];

// Begin testing
describe('compose-transducers', () => {
  describe('map / filter', () => {
    test('gives correct output', () => {
      // Build operation list
      const operationList = [
        {
          type: 'map',
          funcs: [addTwo, multiplyByTen, divideByThree]
        },
        {
          type: 'filter',
          funcs: [filterLessThanTen, filterLessThanOFourteen]
        }
      ];
      // Build a transducer to use & reuse later
      const composedTransducer = composeTransducer(operationList);
      // Get the output
      const output = composedTransducer(input);
      // Test
      expect(output).toEqual([16.666666666666668, 20, 23.333333333333332]);
    });
  });
  describe('map / filter & reduce', () => {
    test('gives correct output', () => {
      // Build operation list
      const operationList = [
        {
          type: 'map',
          funcs: [addTwo, multiplyByTen, divideByThree]
        },
        {
          type: 'filter',
          funcs: [filterLessThanTen, filterLessThanOFourteen]
        }
      ];

      // Build a transducer to use & reuse later
      const composedTransducer = composeTransducer(operationList, 'reduce');

      // Get the output
      const output = composedTransducer(input, addAllNumbers, 0);
      // Test
      expect(output).toEqual(60);
    });
  });
});
