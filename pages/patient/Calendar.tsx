"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Icons_1 = require("../../components/shared/Icons");
var Calendar = function (_a) {
    var selectedDate = _a.selectedDate, onDateChange = _a.onDateChange;
    var _b = (0, react_1.useState)(selectedDate || new Date()), displayDate = _b[0], setDisplayDate = _b[1];
    var handleMonthChange = function (offset) {
        setDisplayDate(function (prev) { return new Date(prev.getFullYear(), prev.getMonth() + offset, 1); });
    };
    var days = (0, react_1.useMemo)(function () {
        var year = displayDate.getFullYear();
        var month = displayDate.getMonth();
        var firstDayOfMonth = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var dayCells = [];
        for (var i = 0; i < firstDayOfMonth; i++) {
            dayCells.push(<div key={"empty-".concat(i)} className="p-2 text-center"></div>);
        }
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var _loop_1 = function (i) {
            var date = new Date(year, month, i);
            var isSelected = (selectedDate === null || selectedDate === void 0 ? void 0 : selectedDate.toDateString()) === date.toDateString();
            var isToday = date.getTime() === today.getTime();
            var isPast = date < today;
            var buttonClasses = "\n                p-2 text-center rounded-full transition-all duration-200 w-10 h-10\n                ".concat(isSelected ? "bg-primary-600 text-white font-bold scale-110 shadow-lg" : "", "\n                ").concat(!isSelected && isToday ? "border-2 border-primary-500 text-primary-600" : "", "\n                ").concat(isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100", "\n            ");
            dayCells.push(<button key={i} disabled={isPast} onClick={function () { return onDateChange(date); }} className={buttonClasses}>
                    {i}
                </button>);
        };
        for (var i = 1; i <= daysInMonth; i++) {
            _loop_1(i);
        }
        return dayCells;
    }, [displayDate, selectedDate, onDateChange]);
    return (<div className="w-full max-w-sm mx-auto text-gray-800 p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
                <button onClick={function () { return handleMonthChange(-1); }} className="p-2 rounded-full hover:bg-gray-100">
                    <Icons_1.ChevronLeftIcon className="w-5 h-5"/>
                </button>
                <h3 className="font-semibold text-lg">
                    {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={function () { return handleMonthChange(1); }} className="p-2 rounded-full hover:bg-gray-100">
                    <Icons_1.ChevronLeftIcon className="w-5 h-5 rotate-180"/>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm text-center text-gray-500 font-medium">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2 items-center justify-items-center">
                {days}
            </div>
        </div>);
};
exports.default = Calendar;
