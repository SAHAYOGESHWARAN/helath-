"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// A basic spinner for fallback purposes. Most of the app uses the themed SpinnerIcon.
var Spinner = function () {
    return (<div className="w-6 h-6 border-4 border-t-primary-500 border-gray-200 rounded-full animate-spin"></div>);
};
exports.default = Spinner;
