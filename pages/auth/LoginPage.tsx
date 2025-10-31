import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { NovoPathIcon, SpinnerIcon, EnvelopeIcon, LockClosedIcon } from '../../components/shared/Icons';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-stretch text-gray-800 bg-gray-50">
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-start mb-8">
            <NovoPathIcon className="w-10 h-10 text-primary-600" />
            <span className="ml-3 text-3xl font-bold">NovoPath</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Sign in to your account</h1>
          <p className="text-gray-600 mb-8">Welcome back! Please enter your details.</p>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setError('');
                const success = await login(values.email, values.password);
                if (!success) {
                    setError('Invalid email or password. Please try again.');
                }
                setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email Address</label>
                   <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <EnvelopeIcon className="w-5 h-5" />
                        </span>
                        <Field 
                            type="email" 
                            name="email" 
                            id="email"
                            placeholder="Email Address"
                            className={`block w-full pl-10 pr-4 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm ${errors.email && touched.email ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
                    <a href="#" className="text-sm text-primary-600 hover:underline ml-auto">Forgot password?</a>
                  </div>
                   <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <LockClosedIcon className="w-5 h-5" />
                        </span>
                        <Field 
                            type="password" 
                            name="password" 
                            id="password"
                            placeholder="Password"
                            className={`block w-full pl-10 pr-4 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm ${errors.password && touched.password ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting || loading}
                  className="w-full mt-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors disabled:bg-primary-400 flex items-center justify-center"
                >
                  {isSubmitting || loading ? <SpinnerIcon /> : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>
           <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-primary-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1974&auto=format&fit=crop')"}}></div>
         <div className="relative z-10 text-white text-center max-w-md">
            <NovoPathIcon className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 leading-tight">The Future of Healthcare is Connected</h2>
            <p className="text-primary-200 text-lg">
                Intelligent, patient-centric, and seamless. Welcome to NovoPath.
            </p>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;