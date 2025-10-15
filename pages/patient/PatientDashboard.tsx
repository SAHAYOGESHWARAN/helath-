import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { CalendarIcon, DocumentTextIcon, PillIcon, MessageSquareIcon, VideoCameraIcon, CreditCardIcon, SparklesIcon, SpinnerIcon } from '../../components/shared/Icons';
import SkeletonCard from '../../components/shared/skeletons/SkeletonCard';
import PageHeader from '../../components/shared/PageHeader';
import { GoogleGenAI } from '@google/genai';

const quickActions = [
    { name: 'Schedule', icon: <CalendarIcon className="w-6 h-6"/>, href: '#/appointments' },
    { name: 'My EMR', icon: <DocumentTextIcon className="w-6 h-6"/>, href: '#/emr' },
    { name: 'My Meds', icon: <PillIcon className="w-6 h-6"/>, href: '#/medications' },
    { name: 'Inbox', icon: <MessageSquareIcon className="w-6 h-6"/>, href: '#/messaging' },
    { name: 'Start Consult', icon: <VideoCameraIcon className="w-6 h-6"/>, href: '#/video-consults' },
    { name: 'Pay Bills', icon: <CreditCardIcon className="w-6 h-6"/>, href: '#/payments' },
];

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Quick Actions">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
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
        </div>


        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Complete Your Profile</h2>
            <p className="text-gray-600 mb-4">Filling out your medical information helps your provider give you the best care. Make sure your EMR is up to date.</p>
            <Link to="/emr" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-transform transform hover:scale-105 inline-block">
                Update My EMR
            </Link>
        </div>
    </div>
  );
};

export default PatientDashboard;