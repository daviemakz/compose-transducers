'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeTransducer = void 0;

require("@babel/polyfill");

var _transducersJs = require("transducers-js");

var _compose = require("./compose");

var _constants = require("./constants");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var validateIteratorList = function validateIteratorList(operationList) {
  return operationList.forEach(function (operation) {
    if (_constants.expectedProps.some(function (prop) {
      return !operation.hasOwnProperty(prop);
    })) {
      throw new Error("Each operation must have the shape {type: 'map' | 'filter', funcs: Functions[]}");
    }
  });
};

var convertTransducerMethod = function convertTransducerMethod(type, funcs) {
  if (!_constants.allowedMethods.includes(type)) {
    throw new Error('ConstructError: Unable to build transducer, supported functions are map or filter');
  }

  var composedFunctions = (0, _compose.functionComposer)(typeof funcs === 'function' ? [funcs] : funcs);
  var methodMapping = {
    map: function map() {
      return (0, _transducersJs.map)(composedFunctions);
    },
    filter: function filter() {
      return (0, _transducersJs.filter)(funcs[0]);
    }
  };
  return methodMapping[type]();
};

var composeTransducer = function composeTransducer(operationList) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
  validateIteratorList(operationList);

  var xf = _transducersJs.comp.apply(void 0, _toConsumableArray(operationList.reduce(function (acc, op) {
    if (op.type === 'map') {
      acc.push(op);
    } else {
      op.funcs.forEach(function (func) {
        acc.push({
          type: 'filter',
          funcs: [func]
        });
      });
    }

    return acc;
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