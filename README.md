# Compose Transducers

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Fcompose-transducers.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Fcompose-transducers?ref=badge_shield)

[![NPM](https://nodei.co/npm/compose-transducers.png?compact=true)](https://www.npmjs.com/package/compose-transducers)

[![Build Status](https://travis-ci.org/daviemakz/compose-transducers.svg?branch=master)](https://travis-ci.org/daviemakz/compose-transducers)
[![Downloads](https://img.shields.io/npm/dm/compose-transducers.svg)](https://www.npmjs.com/package/compose-transducers)
[![dependencies Status](https://david-dm.org/daviemakz/compose-transducers/status.svg)](https://david-dm.org/daviemakz/compose-transducers)
[![devDependencies Status](https://david-dm.org/daviemakz/compose-transducers/dev-status.svg)](https://david-dm.org/daviemakz/compose-transducers?type=dev)

This package combines functional composition and transducers to allow high performance operations from arrays (or other iterables) with minimal garbage collection. Under the hood we utilise [transducer.js](https://github.com/cognitect-labs/transducers-js) and function composition to allow you to build highly efficient data pipelines.

This results in much faster performance than traditional methods without having to implement this yourself.

## Installation

To install simply run:

Yarn:

```
yarn add compose-transducers
```

NPM:

```
npm install compose-transducers --save
```


## Usage

We support map, filter and reduce. Example are below:

### map/filter

The example using map & filter at the same time:

```
// Import package
import { composeTransducer } from 'compose-transducers'

// Define example 'input'
const input = [1,2,3,4,5]

// Build operation list
const operationList = [{
  type:'map',
  funcs: [addTwo, multiplyByTen, divideByThree]
}, {
  type: 'filter',
  funcs:[filterLessThanTen, filterLessThanOFourteen]
}]

// Build a transducer to use & reuse later
const composedTransducer = composeTransducer(operationList)

// Get the output
const output = composedTransducer(input)

// Show output
console.log(output)
```

### reduce

The above example but with a reduce to add all the numbers in the array:

```
// Import package
import { composeTransducer } from 'compose-transducers'

// Define example 'input'
const input = [1,2,3,4,5]

// Build operation list
const operationList = [{
  type:'map',
  funcs: [addTwo, multiplyByTen, divideByThree] // Array of functions taking single input
}, {
  type: 'filter',
  funcs:[filterLessThanTen, filterLessThanOFourteen]  // Array of functions taking single input
}]

// Build a transducer to use & reuse later
const composedTransducer = composeTransducer(operationList, 'reduce')

// Get the output
const output = composedTransducer(input, addAllNumbers, 0) // composedTransducer (input, reducerFunction, initialValue)

// Show output
console.log(output)
```

## Description

Often, when we process data, it’s useful to break up the processing into multiple independent, composable stages. For example, it’s very common to select some data from a larger set, and then process that data (map / filter). You may be tempted to do something like this:

### Problem

```
// Define example 'input'
const input = [1,2,3,4,5]

// Define my operations
const addTwo = number => number + 2
const multiplyByTen = number => number * 10
const divideByThree = number => number / 3
const filterLessThanTen = number => number > 10
const filterLessThanOFourteen = number => number > 14

// Get output
const output  = input.map(addTwo)
                     .map(multiplyByTen)
                     .map(divideByThree)
                     .filter(filterLessThanTen)
                     .filter(filterLessThanOFourteen)

// Show output
console.log(output)
```

Problem with the above is for each `map` or `filter` you execute it returns a brand new array each time meaning we have just created **5** arrays in the code above.

All these arrays will eventually need to be [garbage collected](https://javascript.info/garbage-collection) which if the array is very big (and you're creating new objects with each operation) this will cause unnecessary memory usage and blocking (if you are doing this on the frontend).

### Solution

This package fixes this by composing the `map` and `filter` functions like so:

`.map(addTwo).map(multiplyByTen).map(divideByThree)` into `const applyMaps = (x) => divideByThree(multiplyByTen(addTwo(x)))`

`.filter(filterLessThanTwo).filter(filterLessThanOne)` into `const applyFilters = ((x) => filterLessThanOFourteen(filterLessThanTen(x))`

_NOTE: Filter has to be done slightly differently than shown above but the effect is the same!_

This will turn the above into:

```
// Get output
const output  = input.map(applyMaps).filter(applyFilters)
```

Now we are only creating **2** _transient_ arrays instead of **5** which is an improvement but we can do more and this is where transducers come in. Istead of creating two _transient_ arrays each element will pass through `applyMaps` and `applyFilters` before being placed into the output array.

This in effect means we take an input, perform ALL operations on it and place the results into a **new array** This means we only create one array after this operation, which is the output array. This results in less GC and faster performance especially on the browser.

## Contributing

All contributions are very welcome, please read my [CONTRIBUTING.md](https://github.com/daviemakz/compose-transducers/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/daviemakz/compose-transducers/pulls) or as [GitHub issues](https://github.com/daviemakz/compose-transducers/issues). If you'd like to improve code, please feel free!
