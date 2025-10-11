import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { NovoPathIcon } from '../../components/shared/Icons';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-4 animate-fade-in">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <NovoPathIcon className="w-12 h-12" />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">NovoPath Medical</h1>
        </div>
        <div 
          className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg animate-slide-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-8">Select your role to sign in.</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin(UserRole.PATIENT)}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-all duration-300 transform hover:scale-105"
            >
              Sign in as Patient
            </button>
            <button
              onClick={() => handleLogin(UserRole.PROVIDER)}
              className="w-full text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-all duration-300 transform hover:scale-105"
            >
              Sign in as Provider
            </button>
            <button
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="w-full text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-all duration-300 transform hover:scale-105"
            >
              Sign in as Administrator
            </button>
          </div>
           <p className="text-center text-gray-500 mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
        <p className="text-center text-gray-400 mt-8 text-xs animate-fade-in" style={{ animationDelay: '400ms' }}>
          &copy; {new Date().getFullYear()} NovoPath Medical. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
