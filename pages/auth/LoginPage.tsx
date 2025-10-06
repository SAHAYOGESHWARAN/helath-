

import React from 'react';
// Fix: Corrected import path for useAuth from '../../hooks/useAuth' instead of '../../contexts/AuthContext'
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { TangerineIcon } from '../../components/shared/Icons';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-3">
          <TangerineIcon />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Tangerine Health</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-8">Please select your role to sign in.</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin(UserRole.PATIENT)}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-transform transform hover:scale-105"
            >
              Sign in as Patient
            </button>
            <button
              onClick={() => handleLogin(UserRole.PROVIDER)}
              className="w-full text-white bg-tangerine hover:bg-tangerine-dark focus:ring-4 focus:ring-tangerine-light font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-transform transform hover:scale-105"
            >
              Sign in as Provider
            </button>
            <button
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="w-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-transform transform hover:scale-105"
            >
              Sign in as Administrator
            </button>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-8 text-sm">
          &copy; {new Date().getFullYear()} Tangerine Health. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;