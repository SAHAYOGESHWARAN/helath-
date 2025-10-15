import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { NovoPathIcon, ChevronLeftIcon, SpinnerIcon } from '../../components/shared/Icons';
import { US_STATES, MEDICAL_SPECIALTIES } from '../../constants';

const ProviderRegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  specialty: Yup.string().required('Medical specialty is required'),
  state: Yup.string().required('State of practice is required'),
  licenseNumber: Yup.string().matches(/^[A-Z0-9-]{5,15}$/, 'Invalid license number format').required('Medical license number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      'Must contain at least one uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirming your password is required'),
});

const ProviderRegister: React.FC = () => {
  const { register } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-3">
          <NovoPathIcon />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Provider Registration</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-center text-gray-700 mb-2">Create your Provider Account</h2>
          <p className="text-center text-gray-500 mb-6">Join our network of healthcare professionals.</p>
          
          <Formik
            initialValues={{ name: '', email: '', specialty: '', state: '', licenseNumber: '', password: '', confirmPassword: '' }}
            validationSchema={ProviderRegisterSchema}
            onSubmit={(values) => {
              register({ 
                name: values.name, 
                email: values.email, 
                specialty: values.specialty, 
                state: values.state,
                licenseNumber: values.licenseNumber
              }, UserRole.PROVIDER);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Field type="text" name="name" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                 <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Field type="email" name="email" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Medical Specialty</label>
                        <Field as="select" name="specialty" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white ${errors.specialty && touched.specialty ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Specialty</option>
                            {MEDICAL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Field>
                        <ErrorMessage name="specialty" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State of Practice</label>
                        <Field as="select" name="state" className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white ${errors.state && touched.state ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select State</option>
                            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Field>
                        <ErrorMessage name="state" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                </div>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">Medical License Number</label>
                  <Field type="text" name="licenseNumber" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.licenseNumber && touched.licenseNumber ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="licenseNumber" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                 <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Field type="password" name="password" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <Field type="password" name="confirmPassword" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full mt-2 text-white bg-accent hover:bg-accent-dark focus:ring-4 focus:ring-accent-light font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors disabled:bg-teal-300 flex items-center justify-center">
                  {isSubmitting ? <SpinnerIcon /> : 'Create Account'}
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

export default ProviderRegister;