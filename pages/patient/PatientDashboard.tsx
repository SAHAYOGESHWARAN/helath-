
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { CalendarIcon, DocumentTextIcon, PillIcon, MessageSquareIcon, VideoCameraIcon, CreditCardIcon } from '../../components/shared/Icons';
import SkeletonCard from '../../components/shared/skeletons/SkeletonCard';
import PageHeader from '../../components/shared/PageHeader';

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

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsLoading(false);
      }, 350);
      return () => clearTimeout(timer);
  }, []);
  
  if(isLoading) {
    return (
      <div>
        <div className="h-10 w-3/5 rounded-lg shimmer-bg mb-2"></div>
        <div className="h-6 w-2/5 rounded-lg shimmer-bg mb-8"></div>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={`Welcome, ${user?.name?.split(' ')[0]}!`}
        subtitle="This is your health dashboard. What would you like to do today?"
      />
      
        <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
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
