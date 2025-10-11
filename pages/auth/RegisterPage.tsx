

import React from 'react';
import { Link } from 'react-router-dom';
import { NovoPathIcon, ProfileIcon, UsersIcon, BriefcaseIcon, ChevronLeftIcon } from '../../components/shared/Icons';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-3">
          <NovoPathIcon />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">NovoPath Medical</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Create Your Account</h2>
          <p className="text-center text-gray-500 mb-8">Choose your account type to get started.</p>
          
          <div className="space-y-4">
            <Link
              to="/register/patient"
              className="w-full flex items-center justify-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-transform transform hover:scale-105"
            >
              <ProfileIcon />
              <span className="ml-3">I am a Patient</span>
            </Link>
            <Link
              to="/register/provider"
              className="w-full flex items-center justify-center text-white bg-accent hover:bg-accent-dark focus:ring-4 focus:ring-accent-light font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-transform transform hover:scale-105"
            >
              <UsersIcon />
              <span className="ml-3">I am a Provider</span>
            </Link>
            <Link
              to="/register/admin"
              className="w-full flex items-center justify-center text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-transform transform hover:scale-105"
            >
              <BriefcaseIcon />
              <span className="ml-3">I am an Administrator</span>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
