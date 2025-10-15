
import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { NovoPathIcon, SpinnerIcon } from '../../components/shared/Icons';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

interface LoginPageProps {
  isAdminLogin?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ isAdminLogin = false }) => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4 animate-fade-in">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <NovoPathIcon className="w-12 h-12" />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">NovoPath Medical</h1>
        </div>
        <div 
          className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg animate-slide-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{isAdminLogin ? 'Admin Sign In' : 'Sign In'}</h2>
          <p className="text-center text-gray-500 mb-8">{isAdminLogin ? 'Enter your administrator credentials.' : 'Welcome back! Please enter your details.'}</p>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              const success = await login({ email: values.email, password: values.password });
              if (!success) {
                setFieldError('email', 'Invalid email or password.');
              }
              // On success, App.tsx will handle the redirect automatically.
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Field 
                    type="email" 
                    name="email" 
                    className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`} 
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Field 
                    type="password" 
                    name="password" 
                    className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`} 
                  />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center font-medium rounded-lg text-lg px-5 py-3 text-center transition-all duration-300 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 disabled:bg-primary-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <SpinnerIcon /> : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

           {!isAdminLogin && (
            <p className="text-center text-gray-500 mt-8 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:underline">
                Sign Up
              </Link>
            </p>
           )}
        </div>
        <p className="text-center text-gray-400 mt-8 text-xs animate-fade-in" style={{ animationDelay: '400ms' }}>
          &copy; {new Date().getFullYear()} NovoPath Medical. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;