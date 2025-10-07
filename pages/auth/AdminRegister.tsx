
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { TangerineIcon, ChevronLeftIcon } from '../../components/shared/Icons';

const AdminRegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirming your password is required'),
});

const AdminRegister: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-3">
          <TangerineIcon />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Admin Registration</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-center text-gray-700 mb-2">Create an Administrator Account</h2>
          <p className="text-center text-gray-500 mb-6">Manage the Tangerine Health platform.</p>
          
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={AdminRegisterSchema}
            onSubmit={(values, { setSubmitting }) => {
              register({ name: values.name, email: values.email }, UserRole.ADMIN);
              setSubmitting(false);
              navigate('/dashboard');
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Field type="text" name="name" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                 <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email Address</label>
                  <Field type="email" name="email" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                 <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Field type="password" name="password" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <Field type="password" name="confirmPassword" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full mt-2 text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors disabled:bg-gray-400 disabled:text-white">
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
           <div className="mt-6 text-center">
            <Link to="/register" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Back to Role Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
