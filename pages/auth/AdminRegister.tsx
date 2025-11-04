
import React from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { NovoPathLogoIcon, ChevronLeftIcon, SpinnerIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '../../components/shared/Icons';

const AdminRegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password needs a mix of uppercase, lowercase, numbers, and special characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    // FIX: Use `null` instead of `undefined` in `oneOf` for password confirmation.
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('You must confirm your password'),
});

const FormField: React.FC<{name: string, type: string, label: string, icon: React.ReactNode, error?: string, touched?: boolean}> =
({ name, type, label, icon, error, touched }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 sr-only">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {icon}
            </span>
            <Field
                type={type}
                name={name}
                placeholder={label}
                className={`w-full pl-10 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${error && touched ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
            />
        </div>
        <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1 pl-1" />
    </div>
);

const AdminRegister: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
                <NovoPathLogoIcon className="w-10 h-10 text-primary-600" />
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Create Administrator Account</h1>
            <p className="mt-2 text-gray-600">Manage the NovoPath platform.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={AdminRegisterSchema}
            onSubmit={(values, { setSubmitting }) => {
              register({ name: values.name, email: values.email, password: values.password }, UserRole.ADMIN);
              setSubmitting(false);
              navigate('/dashboard');
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                <FormField name="name" type="text" label="Full Name" icon={<UserIcon className="w-5 h-5" />} error={errors.name} touched={touched.name} />
                <FormField name="email" type="email" label="Work Email Address" icon={<EnvelopeIcon className="w-5 h-5" />} error={errors.email} touched={touched.email} />
                <FormField name="password" type="password" label="Password" icon={<LockClosedIcon className="w-5 h-5" />} error={errors.password} touched={touched.password} />
                <FormField name="confirmPassword" type="password" label="Confirm Password" icon={<LockClosedIcon className="w-5 h-5" />} error={errors.confirmPassword} touched={touched.confirmPassword} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-md px-5 py-3 text-center transition-all disabled:bg-primary-300 flex items-center justify-center"
                >
                  {isSubmitting ? <SpinnerIcon /> : 'Create Admin Account'}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-sm font-medium text-primary-600 hover:underline flex items-center justify-center">
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to account type selection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;