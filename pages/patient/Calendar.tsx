
import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon } from '../../components/shared/Icons';

interface CalendarProps {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
    const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

    const handleMonthChange = (offset: number) => {
        setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const days = useMemo(() => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dayCells = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            dayCells.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;

            const buttonClasses = `
                p-2 text-center rounded-full transition-all duration-200 w-10 h-10
                ${isSelected ? "bg-primary-600 text-white font-bold scale-110 shadow-lg" : ""}
                ${!isSelected && isToday ? "border-2 border-primary-500 text-primary-600" : ""}
                ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
            `;

            dayCells.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => onDateChange(date)}
                    className={buttonClasses}
                >
                    {i}
                </button>
            );
        }
        return dayCells;
    }, [displayDate, selectedDate, onDateChange]);

    return (
        <div className="w-full max-w-sm mx-auto text-gray-800 p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-lg">
                    {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="w-5 h-5 rotate-180" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm text-center text-gray-500 font-medium">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2 items-center justify-items-center">
                {days}
            </div>
        </div>
    );
};

export default Calendar;
