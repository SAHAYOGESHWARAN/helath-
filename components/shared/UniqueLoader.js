"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var UniqueLoader = function () {
    return (<div className="flex flex-col items-center justify-center space-y-4" aria-label="Loading..." role="status">
        <svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <style>
                {"\n                .ekg-line {\n                    stroke-dasharray: 400;\n                    stroke-dashoffset: 400;\n                    animation: draw-line 2.5s ease-in-out infinite;\n                }\n                .ekg-heartbeat {\n                    animation: pulse-heart 2.5s ease-in-out infinite;\n                    transform-origin: 100px 50px;\n                }\n                @keyframes draw-line {\n                    0% {\n                        stroke-dashoffset: 400;\n                    }\n                    30% {\n                        stroke-dashoffset: 0;\n                    }\n                    70% {\n                        stroke-dashoffset: 0;\n                    }\n                    100% {\n                        stroke-dashoffset: -400;\n                    }\n                }\n                @keyframes pulse-heart {\n                    30%, 40% {\n                        transform: scale(1.1);\n                        filter: drop-shadow(0 0 3px #60a5fa);\n                    }\n                    35% {\n                        transform: scale(1.15);\n                        filter: drop-shadow(0 0 5px #3b82f6);\n                    }\n                    0%, 25%, 45%, 100% {\n                        transform: scale(1);\n                        filter: none;\n                    }\n                }\n                "}
            </style>
            <path className="ekg-line" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M0 50 H 80 L 90 30 L 100 70 L 110 50 H 200"/>
            <path className="ekg-heartbeat" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M80 50 L 90 30 L 100 70 L 110 50"/>
        </svg>
        <p className="text-lg font-semibold text-primary-600 animate-pulse">Analyzing Vitals...</p>
    </div>);
};
exports.default = UniqueLoader;
