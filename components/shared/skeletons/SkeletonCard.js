"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SkeletonCard = function (_a) {
    var className = _a.className;
    return (<div className={"bg-white border border-gray-200 rounded-xl shadow-sm p-6 ".concat(className)}>
            <div className="animate-pulse">
                <div className="h-6 w-2/5 rounded shimmer-bg mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 w-full rounded shimmer-bg"></div>
                    <div className="h-4 w-4/5 rounded shimmer-bg"></div>
                    <div className="h-4 w-3/5 rounded shimmer-bg"></div>
                </div>
            </div>
        </div>);
};
exports.default = SkeletonCard;
