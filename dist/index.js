'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeTransducer = void 0;

var _transducersJs = require("transducers-js");

var _compose = require("./compose");

var _constants = require("./constants");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var validateIteratorList = function validateIteratorList(expProps) {
  return function (operationList) {
    operationList.forEach(function (operation) {
      if (expProps.some(function (prop) {
        return !Object.prototype.hasOwnProperty.call(operation, prop);
      })) {
        throw new Error("Each operation must have the shape {type: 'map' | 'filter', funcs: Functions[]}");
      }
    });
    return void 0;
  };
};

var validateOperation = function validateOperation(permittedMethods) {
  return function (type) {
    if (!permittedMethods.includes(type)) {
      throw new Error('ConstructError: Unable to build transducer, supported functions are map or filter');
    }

    return void 0;
  };
};

var convertTransducerMethod = function convertTransducerMethod(type, funcs) {
  validateOperation(_constants.allowedMethods)(type);
  var methodMapping = {
    map: function map() {
      return (0, _transducersJs.map)((0, _compose.functionComposer)(typeof funcs === 'function' ? [funcs] : funcs));
    },
    filter: function filter() {
      return (0, _transducersJs.filter)(funcs[0]);
    }
  };
  return methodMapping[type]();
};

var composeTransducer = function composeTransducer(operationList) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
  validateIteratorList(_constants.expectedProps)(operationList);

  var xf = _transducersJs.comp.apply(void 0, _toConsumableArray(operationList.reduce(function (acc, op) {
    return op.type === 'map' ? acc.concat(op) : acc.concat.apply(acc, _toConsumableArray(op.funcs.map(function (func) {
      return {
        type: 'filter',
        funcs: [func]
      };
    })));
  }, []).map(function (_ref) {
    var type = _ref.type,
        funcs = _ref.funcs;
    return convertTransducerMethod(type, funcs);
  })));

  return mode === 'reduce' ? function (src, func, init) {
    return src.reduce((0, _transducersJs.toFn)(xf, func), init);
  } : function (source) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return (0, _transducersJs.into)(init, xf, source);
  };
};

exports.composeTransducer = composeTransducer;