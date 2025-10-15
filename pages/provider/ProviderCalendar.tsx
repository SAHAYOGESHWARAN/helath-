import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { ChevronLeftIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';

// Interface for appointment data for type safety
interface Appointment {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

// Mock data - In a real app, this would be fetched from an API
const mockAppointments: Appointment[] = [
  { id: 1, title: 'John Doe - Annual Check-up', start: new Date(new Date().setHours(9, 0, 0, 0)), end: new Date(new Date().setHours(10, 0, 0, 0)) },
  { id: 2, title: 'Alice Johnson - Follow-up', start: new Date(new Date().setHours(11, 30, 0, 0)), end: new Date(new Date().setHours(12, 0, 0, 0)) },
  { id: 3, title: 'Bob Williams - Consultation', start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)), end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 45, 0, 0))},
  { id: 4, title: 'Charlie Brown - Sick Visit', start: new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(10, 0, 0, 0)), end: new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(10, 30, 0, 0))},
];

type CalendarView = 'month' | 'week' | 'day';

const AppointmentDetailModal: React.FC<{
  appointment: Appointment | null;
  onClose: () => void;
}> = ({ appointment, onClose }) => {
    if (!appointment) return null;

    const [patientName, reason] = appointment.title.includes(' - ') 
      ? appointment.title.split(' - ') 
      : [appointment.title, 'General Visit'];

    const handleViewChart = () => {
        alert(`Viewing chart for ${patientName}... (mock)`);
        onClose();
    };

    const handleReschedule = () => {
        alert(`Rescheduling appointment for ${patientName}... (mock)`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                
                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-semibold text-lg text-gray-800">{patientName}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Reason for Visit</p>
                        <p className="font-semibold text-lg text-gray-800">{reason}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-lg text-gray-800">
                            {appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointment.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button onClick={handleReschedule} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                        Reschedule
                    </button>
                    <button onClick={handleViewChart} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">
                        View Patient Chart
                    </button>
                </div>
            </div>
        </div>
    );
};

const CalendarHeader: React.FC<{
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onDateChange: (newDate: Date) => void;
}> = ({ currentDate, view, onViewChange, onDateChange }) => {

  const handlePrev = () => {
    let newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    let newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };
  
  const handleToday = () => onDateChange(new Date());

  const getTitle = () => {
    if (view === 'month') return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (view === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5"/></button>
            <button onClick={handleToday} className="px-4 py-2 text-sm font-semibold border rounded-md hover:bg-gray-50">Today</button>
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5 rotate-180"/></button>
            <h2 className="text-xl font-bold text-gray-800 ml-4">{getTitle()}</h2>
        </div>
        <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-md">
            {(['month', 'week', 'day'] as CalendarView[]).map(v => (
                <button 
                    key={v}
                    onClick={() => onViewChange(v)}
                    className={`px-3 py-1 text-sm font-medium rounded-md capitalize ${view === v ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
                >{v}</button>
            ))}
        </div>
    </div>
  );
};

const MonthView: React.FC<{ currentDate: Date; appointments: Appointment[]; onAppointmentClick: (appointment: Appointment) => void; }> = ({ currentDate, appointments, onAppointmentClick }) => {
    const days = useMemo(() => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = date.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let dayCells = [];

        // Add blank cells for previous month
        for (let i = 0; i < firstDay; i++) {
            dayCells.push({ key: `prev-${i}`, date: null, isCurrentMonth: false });
        }
        
        // Add cells for current month
        for (let i = 1; i <= daysInMonth; i++) {
             dayCells.push({ key: `current-${i}`, date: new Date(year, month, i), isCurrentMonth: true });
        }
        
        const remainingCells = 7 - (dayCells.length % 7);
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                dayCells.push({ key: `next-${i}`, date: null, isCurrentMonth: false });
            }
        }

        return dayCells;
    }, [currentDate]);

    const today = new Date();

    return (
        <div className="grid grid-cols-7 flex-1">
            <div className="grid grid-cols-7 col-span-7 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 col-span-7 auto-rows-fr">
                {days.map(({ key, date }, index) => {
                    const isToday = date && date.toDateString() === today.toDateString();
                    const dayAppointments = date 
                        ? appointments.filter(a => a.start.toDateString() === date.toDateString())
                        : [];

                    return (
                        <div key={key} className={`p-2 border-t border-gray-200 flex flex-col min-h-[120px] ${index % 7 !== 0 ? 'border-l' : ''} ${!date ? 'bg-gray-50' : ''}`}>
                            {date && (
                                <span className={`self-start text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-gray-700'}`}>
                                    {date.getDate()}
                                </span>
                            )}
                             <div className="flex-1 space-y-1 overflow-y-auto">
                                {dayAppointments.map(appt => (
                                    <div 
                                      key={appt.id} 
                                      className="bg-primary-100 text-primary-800 p-1.5 rounded-md text-xs truncate cursor-pointer hover:bg-primary-200 transition-colors"
                                      onClick={() => onAppointmentClick(appt)}
                                    >
                                        {appt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} {appt.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TimeGridView: React.FC<{ dates: Date[]; appointments: Appointment[]; onAppointmentClick: (appointment: Appointment) => void; }> = ({ dates, appointments, onAppointmentClick }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getPositionAndHeight = (start: Date, end: Date) => {
        const top = (start.getHours() * 60 + start.getMinutes()) / (24 * 60) * 100;
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        const height = (durationMinutes / (24 * 60)) * 100;
        return { top: `${top}%`, height: `${Math.max(height, 2)}%` }; // Min height for visibility
    };

    return (
        <div className="flex-1 flex overflow-auto">
            <div className="w-16 border-r border-gray-200 text-right">
                {hours.map(hour => (
                    <div key={hour} className="h-24 -mt-3 pr-2 pt-1 relative">
                        {hour > 0 && <span className="text-xs text-gray-500">{`${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'AM' : 'PM'}`}</span>}
                    </div>
                ))}
            </div>
            <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}>
                {dates.map((date, index) => {
                    const dayAppointments = appointments.filter(a => a.start.toDateString() === date.toDateString());
                    return (
                        <div key={index} className="relative border-r border-gray-200">
                            {hours.map(hour => (
                                <div key={hour} className="h-24 border-b border-gray-200"></div>
                            ))}
                            {dayAppointments.map(appt => {
                                const { top, height } = getPositionAndHeight(appt.start, appt.end);
                                return (
                                    <div
                                        key={appt.id}
                                        className="absolute left-2 right-2 p-2 bg-primary-100 border-l-4 border-primary-500 rounded-r-md cursor-pointer hover:bg-primary-200 transition-colors flex flex-col overflow-hidden"
                                        style={{ top, height, minHeight: '24px' }}
                                        onClick={() => onAppointmentClick(appt)}
                                    >
                                        <p className="text-xs font-semibold text-primary-800 truncate">{appt.title}</p>
                                        <p className="text-xs text-primary-600">
                                            {appt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appt.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const ProviderCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
    };

    const weekDates = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [currentDate]);

    const renderView = () => {
        switch(view) {
            case 'week':
                return <TimeGridView dates={weekDates} appointments={mockAppointments} onAppointmentClick={handleAppointmentClick} />;
            case 'day':
                return <TimeGridView dates={[currentDate]} appointments={mockAppointments} onAppointmentClick={handleAppointmentClick} />;
            case 'month':
            default:
                return <MonthView currentDate={currentDate} appointments={mockAppointments} onAppointmentClick={handleAppointmentClick} />;
        }
    };
    
    return (
        <div>
            <PageHeader title="My Calendar" />
            <Card className="p-0 flex flex-col h-[calc(100vh-14rem)]">
                <CalendarHeader 
                    currentDate={currentDate}
                    view={view}
                    onViewChange={setView}
                    onDateChange={setCurrentDate}
                />
                {renderView()}
            </Card>
            <AppointmentDetailModal
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
            />
        </div>
    );
};

export default ProviderCalendar;