"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SkeletonChatBubble = function () {
    return (<div className="flex items-start gap-3 justify-start animate-pulse">
      <div className="w-8 h-8 rounded-full shimmer-bg flex-shrink-0"></div>
      <div className="flex-1 space-y-2 p-3 rounded-lg bg-gray-100 max-w-md">
        <div className="h-4 w-4/5 rounded shimmer-bg"></div>
        <div className="h-4 w-full rounded shimmer-bg"></div>
        <div className="h-4 w-2/3 rounded shimmer-bg"></div>
      </div>
    </div>);
};
exports.default = SkeletonChatBubble;
