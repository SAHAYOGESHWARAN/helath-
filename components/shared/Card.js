"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card = function (_a) {
    var title = _a.title, children = _a.children, className = _a.className, style = _a.style;
    return (<div style={style} className={"\n      bg-white \n      border border-gray-200 rounded-xl shadow-sm\n      ".concat(className || '', "\n    ")}>
      {title && (<div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 tracking-wide">{title}</h2>
        </div>)}
      <div className="p-6">
        {children}
      </div>
    </div>);
};
exports.default = Card;
