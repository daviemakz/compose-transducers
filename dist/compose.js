'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionComposer = void 0;

var functionComposer = function functionComposer(fns) {
  return fns.reverse().reduce(function (g, f) {
    return function () {
      return g(f.apply(void 0, arguments));
    };
  });
};

exports.functionComposer = functionComposer;