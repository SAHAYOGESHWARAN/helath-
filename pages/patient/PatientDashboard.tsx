
import React from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { HealthGoal, Medication } from '../../types';
import { CalendarIcon, ClipboardListIcon, CreditCardIcon, DocumentTextIcon, PillIcon, HeartIcon, CheckCircleIcon } from '../../components/shared/Icons';

const upcomingAppointment = {
    providerName: 'Dr. Jane Smith',
    reason: 'Annual Check-up',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '10:30 AM',
    type: 'In-Person',
};

const healthVitals = [
    { name: 'Blood Pressure', value: '118/78', unit: 'mmHg', icon: <HeartIcon className="w-6 h-6 text-red-500" /> },
    { name: 'Heart Rate', value: '72', unit: 'bpm', icon: <HeartIcon className="w-6 h-6 text-red-500" /> },
    { name: 'Blood Glucose', value: '95', unit: 'mg/dL', icon: <HeartIcon className="w-6 h-6 text-blue-500" /> },
];

const medications: Medication[] = [
    { id: 'med1', name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', prescribedBy: 'Dr. Smith' },
    { id: 'med2', name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', prescribedBy: 'Dr. Smith' },
];

const healthGoals: HealthGoal[] = [
    { id: 'goal1', title: 'Daily Steps', target: 10000, current: 7500, unit: 'steps' },
    { id: 'goal2', title: 'Weekly Exercise', target: 150, current: 90, unit: 'minutes' },
    { id: 'goal3', title: 'Water Intake', target: 8, current: 6, unit: 'glasses' },
];

const quickActions = [
    { name: 'Schedule', icon: <CalendarIcon className="w-6 h-6"/>, href: '#/appointments' },
    { name: 'View Records', icon: <DocumentTextIcon className="w-6 h-6"/>, href: '#/records' },
    { name: 'Pay Bills', icon: <CreditCardIcon className="w-6 h-6"/>, href: '#/payments' },
    { name: 'Request Refill', icon: <PillIcon className="w-6 h-6"/>, href: '#' },
    { name: 'View Claims', icon: <ClipboardListIcon className="w-6 h-6"/>, href: '#/claims' },
];

const HealthGoalItem: React.FC<{ goal: HealthGoal }> = ({ goal }) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                <span className="text-xs font-semibold text-gray-500">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Good Morning, {user?.name?.split(' ')[0]}!</h1>
      <p className="text-lg text-gray-500 mb-8">Here's your health summary for today.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-list">
        
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card 
            title="Upcoming Appointment" 
            className="bg-primary-50 border-primary-200" 
            style={{'--stagger-index': 1} as React.CSSProperties}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-800">{upcomingAppointment.providerName}</p>
                    <p className="text-gray-600 mb-2">{upcomingAppointment.reason} ({upcomingAppointment.type})</p>
                    <div className="flex items-center text-primary-700">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span className="font-semibold">
                            {upcomingAppointment.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {upcomingAppointment.time}
                        </span>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 flex-shrink-0">
                     <a href="#/appointments" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-transform transform hover:scale-105 inline-block">
                        View Details
                    </a>
                </div>
            </div>
          </Card>
          
          <Card title="Quick Actions" style={{'--stagger-index': 2} as React.CSSProperties}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  {quickActions.map(action => (
                      <a href={action.href} key={action.name} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group">
                          <div className="p-3 bg-gray-100 group-hover:bg-primary-100 rounded-full text-gray-600 group-hover:text-primary-600 transition-colors">
                              {action.icon}
                          </div>
                          <p className="mt-2 text-sm font-semibold text-gray-700">{action.name}</p>
                      </a>
                  ))}
              </div>
          </Card>

          <Card title="Today's Medications" style={{ '--stagger-index': 4 } as React.CSSProperties}>
            <div className="space-y-4">
              {medications.map(med => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
                  </div>
                  <button className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full">
                    <CheckCircleIcon className="w-5 h-5 mr-1.5" />
                    Mark as Taken
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card title="Recent Vitals" style={{'--stagger-index': 3} as React.CSSProperties}>
                <div className="space-y-4">
                    {healthVitals.map(vital => (
                        <div key={vital.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                                {vital.icon}
                                <span className="ml-3 font-medium text-gray-700">{vital.name}</span>
                            </div>
                            <span className="font-bold text-gray-800">{vital.value} <span className="text-sm font-normal text-gray-500">{vital.unit}</span></span>
                        </div>
                    ))}
                </div>
                <a href="#/records" className="text-sm font-semibold text-primary-600 hover:underline mt-4 inline-block w-full text-center">View All Trends &rarr;</a>
            </Card>

            <Card title="Health Goals" style={{ '--stagger-index': 5 } as React.CSSProperties}>
              <div className="space-y-4">
                {healthGoals.map(goal => <HealthGoalItem key={goal.id} goal={goal} />)}
              </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
