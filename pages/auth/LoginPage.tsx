import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { NovoPathIcon, SpinnerIcon } from '../../components/shared/Icons';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-4">
          <NovoPathIcon className="w-12 h-12" />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">NovoPath</h1>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-8">Sign in to continue to your dashboard.</p>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
                // In a real app, you would pass values.password as well.
                // For this mock, we only need the email to find the user.
                login(values.email);
                // The App.tsx router will handle navigation once user state changes.
                // No need for navigate() here.
                setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Field 
                    type="email" 
                    name="email" 
                    id="email"
                    className={`mt-1 block w-full px-4 py-3 border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`} 
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-sm text-primary-600 hover:underline">Forgot password?</a>
                  </div>
                  <Field 
                    type="password" 
                    name="password" 
                    id="password"
                    className={`mt-1 block w-full px-4 py-3 border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`} 
                  />
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
        </div>
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
  );
};

export default LoginPage;