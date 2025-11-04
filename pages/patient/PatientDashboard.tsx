
import React, { useState, useEffect, useMemo } from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { 
    SparklesIcon, 
    VideoCameraIcon, 
    DumbbellIcon,
    CalendarIcon,
    PillIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    HeartIcon,
    BeakerIcon,
} from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import Tabs from '../../components/shared/Tabs';
import { HealthGoal, Message } from '../../types';

const GoalProgress: React.FC<{ goal: HealthGoal }> = ({ goal }) => {
    const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
    const isAchieved = goal.current >= goal.target;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-semibold text-gray-700">{goal.title}</p>
                <p className="text-sm font-medium text-gray-500">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${isAchieved ? 'bg-emerald-500' : 'bg-primary-600'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; label: string; link: string; color: string }> = ({ icon, title, value, label, link, color }) => (
    <Link to={link}>
        <Card className={`transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-${color}-200 h-full`}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>{icon}</div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                        <p className="text-sm font-medium text-gray-600">{label}</p>
                    </div>
                </div>
            </div>
        </Card>
    </Link>
);


const PatientDashboard: React.FC = () => {
  const { user, appointments, messages } = useAuth();
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return [...appointments]
        .filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending'))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  const activeMedicationsCount = useMemo(() => user?.medications?.filter(m => m.status === 'Active').length || 0, [user]);
  const primaryGoal = useMemo(() => user?.healthGoals?.[0], [user]);
  const unreadMessages = useMemo(() => Object.values(messages).flat().filter((m: Message) => !m.isRead && m.senderId !== user?.id).length, [messages, user]);

  const vitalsChartData = useMemo(() => {
    if (!user?.vitals) return [];
    return user.vitals.slice(0, 7).reverse().map(v => ({
      date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
      weight: v.weight,
      systolic: parseInt(v.bloodPressure.split('/')[0]),
      diastolic: parseInt(v.bloodPressure.split('/')[1]),
      heartRate: v.heartRate,
    }));
  }, [user?.vitals]);

  const generateSummary = async () => {
    if (!user) {
        setSummaryError('User data is not available to generate a summary.');
        return;
    }
    setIsSummaryLoading(true);
    setSummary('');
    setSummaryError('');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `You are an AI Health Assistant for NovoPath Medical. Your role is to provide a patient-friendly summary of their electronic medical record. Analyze the provided health data and generate a clear, concise summary covering key health highlights, medications, and general wellness tips. CRITICAL: You MUST end EVERY response with the exact disclaimer: "**Disclaimer: I am an AI assistant... consult with your doctor.**"`;
        const response = await ai.models.generateContent({
            // FIX: Use gemini-2.5-flash instead of deprecated gemini-1.5-flash
            model: "gemini-2.5-flash",
            contents: `Please summarize this health data for the patient, ${user.name}: Conditions: ${user.conditions?.map(c => c.name).join(', ') || 'None'}. Medications: ${user.medications?.filter(m => m.status === 'Active').map(m => m.name).join(', ') || 'None'}.`,
            config: { systemInstruction }
        });
        // FIX: Correctly access text from response
        setSummary(response.text);
    } catch (error) {
        console.error("Error generating health summary:", error);
        setSummaryError('Sorry, I was unable to generate your summary at this time.');
    } finally {
        setIsSummaryLoading(false);
    }
  };
  
  const BPChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={vitalsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{fontSize: 12}} />
        <YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}} stroke="#ef4444" label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}} stroke="#f97316" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
        <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
        <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#f97316" name="Heart Rate (bpm)" />
      </LineChart>
    </ResponsiveContainer>
  );

  const WeightChart = () => (
      <ResponsiveContainer width="100%" height={250}>
          <BarChart data={vitalsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}}/>
              <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.7)'}}/>
              <Bar dataKey="weight" fill="#3b82f6" name="Weight (lbs)" barSize={30} radius={[4, 4, 0, 0]}/>
          </BarChart>
      </ResponsiveContainer>
  );

  const vitalsTabs = [
      { name: 'BP & Heart Rate', icon: <HeartIcon />, content: <BPChart /> },
      { name: 'Weight', icon: <DumbbellIcon />, content: <WeightChart /> },
  ];
  
  const quickActions = [
      { name: 'Schedule Appointment', href: '/patient/appointments', icon: <CalendarIcon className="w-5 h-5 text-primary-600"/> },
      { name: 'View Health Records', href: '/patient/emr', icon: <DocumentTextIcon className="w-5 h-5 text-emerald-600"/> },
      { name: 'View Lab Results', href: '/patient/lab-results', icon: <BeakerIcon className="w-5 h-5 text-indigo-600"/> },
      { name: 'Message My Provider', href: '/patient/messaging', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-600"/> },
      { name: 'Pay My Bill', href: '/patient/payments', icon: <CurrencyDollarIcon className="w-5 h-5 text-amber-600"/> },
      { name: 'Start a Video Visit', href: '/patient/video-consults', icon: <VideoCameraIcon className="w-5 h-5 text-rose-600"/> },
  ];

  return (
    <div>
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        subtitle="Here’s your health summary for today."
      />
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                icon={<CalendarIcon className="w-6 h-6 text-primary-600"/>}
                title="Next Appointment"
                value={nextAppointment ? new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                label={nextAppointment?.time || ''}
                link="/patient/appointments"
                color="primary"
            />
             <StatCard 
                icon={<PillIcon className="w-6 h-6 text-emerald-600"/>}
                title="Active Medications"
                value={activeMedicationsCount}
                label="meds"
                link="/patient/medications"
                color="emerald"
            />
             <StatCard 
                icon={<DumbbellIcon className="w-6 h-6 text-amber-600"/>}
                title={primaryGoal?.title || "No Goals Set"}
                value={primaryGoal?.current || 0}
                label={primaryGoal?.unit || 'goals'}
                link="/patient/goals"
                color="amber"
            />
             <StatCard 
                icon={<ChatBubbleLeftRightIcon className="w-6 h-6 text-sky-600"/>}
                title="Unread Messages"
                value={unreadMessages}
                label="messages"
                link="/patient/messaging"
                color="sky"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
                 <Card title="Your AI Health Summary">
                    {isSummaryLoading ? (
                        <div className="space-y-3 animate-pulse p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ) : summary ? (
                        <div className="text-sm text-gray-700 space-y-2 p-4" style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-gray-600 mb-4">Get a quick, easy-to-understand overview of your health records.</p>
                            {summaryError && <p className="text-red-500 text-sm mb-4">{summaryError}</p>}
                            <button onClick={generateSummary} disabled={isSummaryLoading} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm inline-flex items-center">
                                <SparklesIcon className="w-5 h-5 mr-2" /> Generate My Summary
                            </button>
                        </div>
                    )}
                </Card>
                <Card title="Your Vitals">
                    <Tabs tabs={vitalsTabs} />
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card title="Quick Actions">
                    <div className="space-y-2">
                        {quickActions.map(action => (
                            <Link key={action.name} to={action.href} className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="p-2 bg-gray-100 rounded-lg">{action.icon}</div>
                                <span className="ml-4 font-semibold text-gray-700">{action.name}</span>
                                <ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400" />
                            </Link>
                        ))}
                    </div>
                </Card>
                <Card title="Health Goals">
                    <div className="space-y-4">
                        {user?.healthGoals && user.healthGoals.length > 0 ? (
                            user.healthGoals.map(goal => <GoalProgress key={goal.id} goal={goal} />)
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p className="font-semibold text-gray-700">No Health Goals Yet</p>
                                <Link to="/patient/goals" className="mt-2 inline-block text-primary-600 font-semibold hover:underline text-sm">
                                    Set Goals
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default PatientDashboard;