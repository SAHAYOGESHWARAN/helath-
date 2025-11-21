
import React from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { NovoPathLogoIcon, SpinnerIcon, EnvelopeIcon, LockClosedIcon } from '../../components/shared/Icons';
import { useApp } from '../../contexts/AppContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
                <NovoPathLogoIcon className="w-10 h-10 text-primary-600" />
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-gray-600">Welcome back to NovoPath Medical Inc.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const success = await login(values.email, values.password);
              if (!success) {
                showToast('Invalid credentials. Please try again.', 'error');
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                    <label htmlFor="email-login" className="sr-only">Email Address</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <EnvelopeIcon className="w-5 h-5" />
                        </span>
                        <Field type="email" name="email" id="email-login" placeholder="Email Address" className={`w-full pl-10 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.email && touched.email ? 'border-red-500 ring-red-500' : 'border-gray-300'}`} />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-red-600 text-xs mt-1 pl-1" />
                </div>
                 <div>
                    <label htmlFor="password-login" className="sr-only">Password</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <LockClosedIcon className="w-5 h-5" />
                        </span>
                        <Field type="password" name="password" id="password-login" placeholder="Password" className={`w-full pl-10 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.password && touched.password ? 'border-red-500 ring-red-500' : 'border-gray-300'}`} />
                    </div>
                     <ErrorMessage name="password" component="p" className="text-red-600 text-xs mt-1 pl-1" />
                </div>
                 <button type="submit" disabled={isSubmitting} className="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-md px-5 py-3 text-center transition-all disabled:bg-primary-300 flex items-center justify-center">
                  {isSubmitting ? <SpinnerIcon /> : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;