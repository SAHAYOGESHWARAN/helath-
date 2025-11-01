"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ToggleSwitch = function (_a) {
    var name = _a.name, checked = _a.checked, onChange = _a.onChange, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    return (<label className={"relative inline-flex items-center flex-shrink-0 ".concat(disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" disabled={disabled}/>
        <div className={"w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ".concat(disabled ? 'opacity-50' : '')}></div>
    </label>);
};
exports.default = ToggleSwitch;
