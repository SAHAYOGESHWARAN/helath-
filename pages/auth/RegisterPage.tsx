import React from 'react';
import { Link } from 'react-router-dom';
import { NovoPathLogoIcon, UserIcon, BriefcaseIcon } from '../../components/shared/Icons';

const RoleSelectionCard: React.FC<{ to: string, icon: React.ReactNode, title: string, description: string, buttonText: string }> =
({ to, icon, title, description, buttonText }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-primary-100 text-primary-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-8 flex-grow">{description}</p>
            <Link
                to={to}
                className="w-full bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all shadow-md"
            >
                {buttonText}
            </Link>
        </div>
    );
};

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6" style={{backgroundImage: "url('/pattern-light.svg')"}}>
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
            <Link to="/" className="inline-block mb-6">
                <NovoPathLogoIcon className="w-12 h-12 text-primary-600" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Join NovoPath</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Choose your account type to get started on your personalized healthcare journey.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
            <RoleSelectionCard
                to="/register/patient"
                icon={<UserIcon className="w-10 h-10" />}
                title="For Patients"
                description="Create an account to manage your health records, schedule appointments with top providers, and access AI-powered health insights."
                buttonText="Create Patient Account"
            />
            <RoleSelectionCard
                to="/register/provider"
                icon={<BriefcaseIcon className="w-10 h-10" />}
                title="For Providers"
                description="Join our network to streamline your practice, connect with patients, and utilize our state-of-the-art EMR system."
                buttonText="Create Provider Account"
            />
        </div>

        <div className="text-center mt-12">
            <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:underline">
                    Sign In Here
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
