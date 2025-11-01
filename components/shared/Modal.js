"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};
var Modal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, children = _a.children, footer = _a.footer, _b = _a.size, size = _b === void 0 ? 'md' : _b;
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 modal-backdrop" onClick={onClose}>
            <div className={"bg-white rounded-lg shadow-xl w-full mx-4 flex flex-col transition-transform duration-300 ".concat(sizeClasses[size], " animate-slide-in-up")} onClick={function (e) { return e.stopPropagation(); }}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl p-1 leading-none">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {children}
                </div>

                {footer && (<div className="flex justify-end space-x-3 p-4 bg-white border-t border-gray-200 rounded-b-lg">
                        {footer}
                    </div>)}
            </div>
        </div>);
};
exports.default = Modal;
