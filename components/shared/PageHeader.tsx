"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Icons_1 = require("./Icons");
var PageHeader = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, buttonText = _a.buttonText, onButtonClick = _a.onButtonClick, children = _a.children;
    return (<div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="mt-1 text-lg text-gray-500">{subtitle}</p>}
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    {children}
                    {buttonText && onButtonClick && (<button onClick={onButtonClick} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 flex items-center">
                        <Icons_1.PlusIcon className="w-5 h-5 mr-2"/>
                        <span>{buttonText}</span>
                        </button>)}
                </div>
            </div>
        </div>);
};
exports.default = PageHeader;
