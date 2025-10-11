import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { HealthGoal, Medication, LabResult, Surgery, Hospitalization } from '../../types';
import { CalendarIcon, ClipboardListIcon, CreditCardIcon, DocumentTextIcon, PillIcon, CheckCircleIcon, MessageSquareIcon, ChevronDownIcon } from '../../components/shared/Icons';

// --- MOCK DATA ---
const upcomingAppointment = {
    providerName: 'Dr. Jane Smith',
    reason: 'Annual Check-up',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '10:30 AM',
    type: 'In-Person',
};

const healthTrendData = [
    { name: 'Mon', systolic: 122, diastolic: 81, heartRate: 75 },
    { name: 'Tue', systolic: 125, diastolic: 80, heartRate: 72 },
    { name: 'Wed', systolic: 120, diastolic: 79, heartRate: 69 },
    { name: 'Thu', systolic: 124, diastolic: 82, heartRate: 74 },
    { name: 'Fri', systolic: 119, diastolic: 78, heartRate: 70 },
    { name: 'Sat', systolic: 121, diastolic: 80, heartRate: 71 },
    { name: 'Sun', systolic: 118, diastolic: 78, heartRate: 72 },
];

const medications: (Medication & { adherence: number })[] = [
    { id: 'med1', name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', prescribedBy: 'Dr. Smith', startDate: '2023-01-15', status: 'Active', adherence: 95 },
    { id: 'med2', name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', prescribedBy: 'Dr. Smith', startDate: '2023-01-15', status: 'Active', adherence: 89 },
];

const activeMedications = medications.filter(m => m.status === 'Active');
const overallAdherence = activeMedications.length > 0 
  ? Math.round(activeMedications.reduce((sum, med) => sum + med.adherence, 0) / activeMedications.length) 
  : 0;

const medicationAdherence = {
    percentage: overallAdherence,
    data: [{ name: 'Adherence', value: overallAdherence }]
};


const recentLabResult: LabResult = {
    id: 'lab1', testName: 'Lipid Panel', date: '2024-08-10', status: 'Final',
    components: [{ name: 'Total Cholesterol', value: '180 mg/dL', referenceRange: '<200 mg/dL', isAbnormal: false }]
};

const unreadMessages = 2;

const healthGoals: HealthGoal[] = [
    { id: 'goal1', title: 'Daily Steps', target: 10000, current: 7500, unit: 'steps', deadline: '2024-12-31' },
    { id: 'goal2', title: 'Weekly Exercise', target: 150, current: 90, unit: 'minutes', deadline: '2024-12-31' },
];

const quickActions = [
    { name: 'Schedule', icon: <CalendarIcon className="w-6 h-6"/>, href: '#/appointments' },
    { name: 'View Records', icon: <DocumentTextIcon className="w-6 h-6"/>, href: '#/records' },
    { name: 'My Meds', icon: <PillIcon className="w-6 h-6"/>, href: '#/medications' },
    { name: 'Inbox', icon: <MessageSquareIcon className="w-6 h-6"/>, href: '#/messaging' },
    { name: 'Pay Bills', icon: <CreditCardIcon className="w-6 h-6"/>, href: '#/payments' },
];

const conditions: string[] = ['Hypertension', 'Asthma'];

const surgeries: Surgery[] = [
    { id: 'surg1', name: 'Appendectomy', date: '2015-06-20' },
    { id: 'surg2', name: 'ACL Knee Repair', date: '2019-11-02' },
];

const hospitalizations: Hospitalization[] = [
    { id: 'hosp1', reason: 'Pneumonia', admissionDate: '2021-02-10', dischargeDate: '2021-02-15' },
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

const MedicationAdherenceItem: React.FC<{ medication: Medication & { adherence: number } }> = ({ medication }) => {
    const getAdherenceColor = (adherence: number) => {
        if (adherence >= 90) return 'bg-emerald-500';
        if (adherence >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };
     const getAdherenceTextColor = (adherence: number) => {
        if (adherence >= 90) return 'text-emerald-500';
        if (adherence >= 70) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-700 truncate" title={medication.name}>{medication.name}</span>
                <span className={`text-sm font-bold ${getAdherenceTextColor(medication.adherence)}`}>{medication.adherence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${getAdherenceColor(medication.adherence)} h-2 rounded-full`} style={{ width: `${medication.adherence}%` }}></div>
            </div>
        </div>
    );
};


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-600">{label}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }} className="text-sm">{`${pld.name}: ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div>
      <button 
        onClick={onToggle} 
        className="w-full flex justify-between items-center text-left font-semibold text-gray-700 hover:bg-gray-50 p-4 transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};


const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [openSections, setOpenSections] = useState({
    conditions: true,
    surgeries: true,
    hospitalizations: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Good Morning, {user?.name?.split(' ')[0]}!</h1>
      <p className="text-lg text-gray-500 mb-8">Here's your health summary for today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 stagger-list md:items-stretch">
        
        {/* Main Column */}
        <div className="md:col-span-3 flex flex-col gap-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <Card title="Recent Lab Results" style={{'--stagger-index': 3} as React.CSSProperties}>
                <p className="font-semibold text-gray-800">{recentLabResult.testName}</p>
                <p className="text-sm text-gray-500 mb-2">on {recentLabResult.date}</p>
                <div className="bg-emerald-50 text-emerald-800 p-2 rounded-md text-sm text-center">
                    All results within normal range.
                </div>
                <a href="#/records" className="text-sm font-semibold text-primary-600 hover:underline mt-4 inline-block w-full text-center">View Full Report &rarr;</a>
             </Card>
             <Card title="Unread Messages" style={{'--stagger-index': 4} as React.CSSProperties}>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-5xl font-bold text-accent">{unreadMessages}</p>
                    <p className="text-gray-600 mt-1">messages from your provider</p>
                    <a href="#/messaging" className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg mt-4 text-sm">
                        Go to Inbox
                    </a>
                </div>
             </Card>
             <Card title="Medication Adherence" style={{'--stagger-index': 5} as React.CSSProperties}>
                 <div className="relative h-28 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" barSize={12} data={medicationAdherence.data} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background clockWise dataKey="value" cornerRadius={10} fill="#3b82f6" />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{medicationAdherence.percentage}%</span>
                        <span className="text-xs text-gray-500">Overall</span>
                    </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">Adherence by Medication</h4>
                    <div className="space-y-3">
                        {activeMedications.map(med => <MedicationAdherenceItem key={med.id} medication={med} />)}
                    </div>
                 </div>
                 <a href="#/medications" className="text-sm font-semibold text-primary-600 hover:underline mt-4 inline-block w-full text-center">Manage Meds &rarr;</a>
            </Card>
          </div>
          
          <Card title="Health Trends (Last 7 Days)" style={{'--stagger-index': 6} as React.CSSProperties}>
             <ResponsiveContainer width="100%" height={250}>
                <LineChart data={healthTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7281', fontSize: 12 }} />
                    <YAxis yAxisId="left" label={{ value: 'mmHg', angle: -90, position: 'insideLeft', fill: '#6b7281', dx: -10 }} tick={{ fill: '#6b7281', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'bpm', angle: -90, position: 'insideRight', fill: '#6b7281', dx: 10 }} tick={{ fill: '#6b7281', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                    <Line yAxisId="left" type="monotone" dataKey="systolic" name="Systolic BP" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="left" type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
          </Card>

        </div>

        {/* Side Column */}
        <div className="md:col-span-2 flex flex-col gap-6">
            <Card title="Today's Medications" style={{ '--stagger-index': 7 } as React.CSSProperties}>
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

            <Card title="Health Goals" style={{ '--stagger-index': 8 } as React.CSSProperties}>
              <div className="space-y-4">
                {healthGoals.map(goal => <HealthGoalItem key={goal.id} goal={goal} />)}
              </div>
            </Card>

            <Card title="Medical History" style={{ '--stagger-index': 9 } as React.CSSProperties} className="overflow-hidden">
                <div className="-m-6">
                    <div className="divide-y divide-gray-200">
                        <CollapsibleSection title="Conditions" isOpen={openSections.conditions} onToggle={() => toggleSection('conditions')}>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {conditions.map((condition, index) => (
                                <span key={index} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                    {condition}
                                </span>
                                ))}
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Surgeries" isOpen={openSections.surgeries} onToggle={() => toggleSection('surgeries')}>
                            <ul className="space-y-3 pt-2">
                                {surgeries.map(surgery => (
                                <li key={surgery.id} className="p-3 bg-gray-50 border-l-4 border-primary-400 rounded-r-md">
                                    <p className="font-semibold text-gray-800 text-sm">{surgery.name}</p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                                    {new Date(surgery.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </li>
                                ))}
                            </ul>
                        </CollapsibleSection>

                        <CollapsibleSection title="Hospitalizations" isOpen={openSections.hospitalizations} onToggle={() => toggleSection('hospitalizations')}>
                            <ul className="space-y-3 pt-2">
                                {hospitalizations.map(hosp => (
                                <li key={hosp.id} className="p-3 bg-gray-50 border-l-4 border-accent rounded-r-md">
                                    <p className="font-semibold text-gray-800 text-sm">{hosp.reason}</p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                                    {new Date(hosp.admissionDate).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })} - {new Date(hosp.dischargeDate).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </li>
                                ))}
                            </ul>
                        </CollapsibleSection>
                    </div>
                </div>
            </Card>

        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;