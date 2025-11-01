"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SkeletonTableRow = function (_a) {
    var columns = _a.columns;
    return (<tr>
            {Array.from({ length: columns }).map(function (_, i) { return (<td key={i} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 rounded shimmer-bg"></div>
                </td>); })}
        </tr>);
};
exports.default = SkeletonTableRow;
