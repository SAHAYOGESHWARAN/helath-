
import React from 'react';
import { Link } from 'react-router-dom';
import { NovoPathIcon, ProfileIcon, UsersIcon, ChevronLeftIcon } from '../../components/shared/Icons';

// A reusable card component for the role selection
const RoleCard: React.FC<{ to: string, icon: React.ReactNode, title: string, description: string, colorClasses: string }> = 
({ to, icon, title, description, colorClasses }) => {
    return (
        <Link 
            to={to} 
            className={`group block text-center p-8 border-2 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${colorClasses}`}
        >
            <div className="flex justify-center items-center mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>
            <span className="inline-block font-semibold bg-white text-gray-800 group-hover:bg-opacity-90 px-6 py-2 rounded-full shadow-md transition-transform transform group-hover:scale-105">
                Get Started &rarr;
            </span>
        </Link>
    );
};


const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full mx-auto text-center">
        
        <div className="flex justify-center items-center mb-4 space-x-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <NovoPathIcon className="w-12 h-12" />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Welcome to NovoPath</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2 animate-slide-in-up" style={{ animationDelay: '200ms' }}>Choose Your Path</h2>
        <p className="text-gray-500 mb-12 animate-slide-in-up" style={{ animationDelay: '300ms' }}>Select the account type that best describes you.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
            <RoleCard 
                to="/register/patient"
                icon={<ProfileIcon className="w-12 h-12 text-primary-600" />}
                title="I am a Patient"
                description="Take control of your health. Schedule appointments, access your medical records, and connect with your provider seamlessly."
                colorClasses="border-primary-300 hover:border-primary-500 bg-blue-50"
            />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '500ms' }}>
            <RoleCard 
                to="/register/provider"
                icon={<UsersIcon className="w-12 h-12 text-accent-dark" />}
                title="I am a Provider"
                description="Streamline your practice. Manage patients, appointments, and billing with our powerful, integrated tools."
                colorClasses="border-teal-300 hover:border-accent bg-teal-50"
            />
          </div>
        </div>

        <div className="text-center mt-10 space-y-4 animate-slide-in-up" style={{ animationDelay: '600ms' }}>
            <p className="text-sm text-gray-600">
                Already have a patient or provider account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
