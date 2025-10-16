import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { CalendarIcon, SparklesIcon, VideoCameraIcon } from '../../components/shared/Icons';
import SkeletonCard from '../../components/shared/skeletons/SkeletonCard';
import PageHeader from '../../components/shared/PageHeader';
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';

const GoalProgress: React.FC<{ goal: any }> = ({ goal }) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    const isAchieved = goal.current >= goal.target;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-semibold text-gray-700">{goal.title}</p>
                <p className="text-sm font-medium text-gray-500">{goal.current} / {goal.target} {goal.unit}</p>
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


const PatientDashboard: React.FC = () => {
  const { user, appointments } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return [...appointments]
        .filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending'))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  const vitalsChartData = useMemo(() => {
    if (!user?.vitals) return [];
    return user.vitals.slice(0, 4).reverse().map(v => ({
      date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
      weight: v.weight,
      systolic: parseInt(v.bloodPressure.split('/')[0]),
      diastolic: parseInt(v.bloodPressure.split('/')[1]),
      heartRate: v.heartRate,
    }));
  }, [user?.vitals]);

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsLoading(false);
      }, 350);
      return () => clearTimeout(timer);
  }, []);

  const generateSummary = async () => {
    if (!user || !process.env.API_KEY) {
        setSummaryError('AI service is not available. Please try again later.');
        return;
    }

    setIsSummaryLoading(true);
    setSummary('');
    setSummaryError('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const emrData = `
            - Conditions: ${user.conditions?.map(c => c.name).join(', ') || 'None listed'}
            - Allergies: ${user.allergies?.map(a => `${a.name} (${a.severity})`).join(', ') || 'None listed'}
            - Medications: ${user.medications?.filter(m => m.status === 'Active').map(m => `${m.name} ${m.dosage}`).join(', ') || 'None listed'}
            - Surgeries: ${user.surgeries?.map(s => s.name).join(', ') || 'None listed'}
            - Lifestyle: Smoking: ${user.lifestyle?.smokingStatus}, Alcohol: ${user.lifestyle?.alcoholConsumption}
        `;

        const systemInstruction = `You are an AI Health Assistant for NovoPath Medical. Your role is to provide a patient-friendly summary of their electronic medical record.
        Analyze the provided health data and generate a clear, concise summary covering:
        1.  A brief, positive opening statement.
        2.  Key health highlights (active conditions, important allergies).
        3.  A summary of current medications.
        4.  One or two general wellness tips based on their lifestyle information.
        
        CRITICAL SAFETY INSTRUCTIONS:
        - DO NOT provide a diagnosis or medical advice.
        - DO NOT interpret results or predict outcomes.
        - Your tone should be encouraging and informative, not alarming.
        - You MUST end EVERY response with the exact disclaimer: "**Disclaimer: I am an AI assistant and not a medical professional. This information is not a substitute for professional medical advice. Please consult with a doctor for diagnosis and treatment.**"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please summarize this health data for the patient, ${user.name}: ${emrData}`,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        setSummary(response.text);

    } catch (error) {
        console.error("Error generating health summary:", error);
        setSummaryError('Sorry, I was unable to generate your summary at this time.');
    } finally {
        setIsSummaryLoading(false);
    }
  };
  
  if(isLoading) {
    return (
      <div>
        <div className="h-10 w-3/5 rounded-lg shimmer-bg mb-2"></div>
        <div className="h-6 w-2/5 rounded-lg shimmer-bg mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={`Welcome, ${user?.name?.split(' ')[0]}!`}
        subtitle="This is your health dashboard. What would you like to do today?"
      />
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 {nextAppointment && (
                    <Card className="bg-primary-50 border-primary-200">
                        <h3 className="font-bold text-xl text-primary-800 mb-2">Your Next Appointment</h3>
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-center justify-center bg-white text-primary-700 rounded-lg p-3 w-20 text-center shadow-sm">
                                    <span className="text-sm font-bold uppercase">{new Date(nextAppointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}</span>
                                    <span className="text-2xl font-extrabold">{new Date(nextAppointment.date).getUTCDate()}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{nextAppointment.reason}</p>
                                    <p className="text-sm text-gray-600">with {nextAppointment.providerName}</p>
                                    <p className="text-sm text-gray-500 mt-1">{nextAppointment.time} ({nextAppointment.type})</p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex space-x-2">
                                <Link to="/appointments" className="bg-white hover:bg-gray-100 text-primary-700 font-bold py-2 px-4 rounded-lg text-sm border border-primary-200">Manage</Link>
                                {nextAppointment.type === 'Virtual' && <Link to="/video-consults" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center"><VideoCameraIcon className="w-4 h-4 mr-2"/> Join Call</Link>}
                            </div>
                         </div>
                    </Card>
                )}
                 <Card title="Your AI Health Summary">
                    {isSummaryLoading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ) : summary ? (
                        <div className="text-sm text-gray-700 space-y-2" style={{ whiteSpace: 'pre-wrap' }}>
                            {summary}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Get a quick, easy-to-understand overview of your health records.</p>
                            {summaryError && <p className="text-red-500 text-sm mb-4">{summaryError}</p>}
                            <button 
                                onClick={generateSummary}
                                disabled={isSummaryLoading}
                                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-transform transform hover:scale-105 inline-flex items-center"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                Generate My Summary
                            </button>
                        </div>
                    )}
                </Card>
                 <Card title="Blood Pressure (mmHg) & Heart Rate (bpm)">
                     <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={vitalsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}} stroke="#ef4444" />
                            <YAxis yAxisId="right" orientation="right" domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}} stroke="#f97316" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
                            <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                            <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#f97316" name="Heart Rate (bpm)" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Weight (lbs)">
                     <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={vitalsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{fontSize: 12}}/>
                            <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.7)'}}/>
                            <Bar dataKey="weight" fill="#3b82f6" name="Weight (lbs)" barSize={30} radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                 <Card title="Health Goals">
                    <div className="space-y-4">
                        {user?.healthGoals && user.healthGoals.length > 0 ? (
                            user.healthGoals.map(goal => <GoalProgress key={goal.id} goal={goal} />)
                        ) : (
                            <p className="text-sm text-gray-500 text-center">No health goals set. Talk to your provider to set one up.</p>
                        )}
                    </div>
                </Card>
                 <Card>
                     <h3 className="font-bold text-xl text-gray-800 mb-4">Quick Links</h3>
                    <div className="space-y-3">
                        <Link to="/emr" className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 font-medium">Update My EMR</Link>
                        <Link to="/appointments" className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 font-medium">Schedule Appointment</Link>
                        <Link to="/messaging" className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 font-medium">Message My Provider</Link>
                         <Link to="/payments" className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 font-medium">Pay My Bill</Link>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default PatientDashboard;