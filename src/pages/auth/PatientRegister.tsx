
import React from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { NovoPathLogoIcon, ChevronLeftIcon, SpinnerIcon, UserIcon, EnvelopeIcon, LockClosedIcon, CalendarIcon, MapPinIcon, CheckCircleIcon } from '../../components/shared/Icons';
import { US_STATES } from '../../constants';

const PatientRegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').max(50, 'Name is too long').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  dob: Yup.date().max(new Date(), "Date of birth cannot be in the future").required('Date of birth is required'),
  state: Yup.string().required('State is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password needs a mix of uppercase, lowercase, numbers, and special characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    // FIX: Use `null` instead of `undefined` in `oneOf` for password confirmation, which is better practice and may resolve a subtle type error.
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('You must confirm your password'),
});

const FormField: React.FC<{name: string, type: string, label: string, icon: React.ReactNode, as?: string, children?: React.ReactNode, error?: string, touched?: boolean}> =
({ name, type, label, icon, as, children, error, touched }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 sr-only">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                {icon}
            </span>
            <Field
                as={as}
                type={type}
                name={name}
                placeholder={label}
                className={`w-full pl-11 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${error && touched ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
            >
                {children}
            </Field>
        </div>
        <ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1 pl-1" />
    </div>
);

const PatientRegister: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left decorative column */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 to-teal-500 p-12 flex-col justify-between text-white animate-fade-in">
        <div>
          <Link to="/" className="flex items-center space-x-3">
              <NovoPathLogoIcon className="w-10 h-10" />
              <span className="text-2xl font-bold">NovoPath</span>
          </Link>
          <div className="mt-16 animate-slide-in-up" style={{animationDelay: '200ms'}}>
            <h1 className="text-4xl font-bold leading-tight">Your Path to Personalized Health Starts Here.</h1>
            <p className="mt-4 text-primary-100 max-w-md">Join NovoPath to take control of your healthcare journey with tools designed for you.</p>
          </div>
        </div>
        <div className="space-y-4 text-primary-100 animate-slide-in-up" style={{animationDelay: '400ms'}}>
            <div className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-emerald-300 mr-3" />
                <span>Manage appointments and records seamlessly.</span>
            </div>
             <div className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-emerald-300 mr-3" />
                <span>Access AI-powered health summaries.</span>
            </div>
             <div className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-emerald-300 mr-3" />
                <span>Connect with providers via secure messaging.</span>
            </div>
        </div>
      </div>

      {/* Right form column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 animate-slide-in-up">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Create your Patient Account</h2>
                <p className="mt-2 text-gray-600">Let's get you set up to manage your health.</p>
            </div>
          
            <Formik
                initialValues={{ name: '', email: '', dob: '', state: '', password: '', confirmPassword: '' }}
                validationSchema={PatientRegisterSchema}
                onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    register({ name: values.name, email: values.email, dob: values.dob, state: values.state, password: values.password }, UserRole.PATIENT);
                    setSubmitting(false);
                    navigate('/dashboard', { replace: true });
                }, 500);
                }}
            >
                {({ isSubmitting, errors, touched }) => (
                <Form className="mt-8 space-y-6">
                    <fieldset className="space-y-5">
                        <legend className="sr-only">Account Details</legend>
                        <FormField name="name" type="text" label="Full Name" icon={<UserIcon className="w-5 h-5" />} error={errors.name} touched={touched.name} />
                        <FormField name="email" type="email" label="Email Address" icon={<EnvelopeIcon className="w-5 h-5" />} error={errors.email} touched={touched.email} />
                    </fieldset>

                     <fieldset className="space-y-5 pt-4">
                        <legend className="text-sm font-semibold text-gray-500 mb-2">Personal Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="dob" type="date" label="Date of Birth" icon={<CalendarIcon className="w-5 h-5" />} error={errors.dob} touched={touched.dob} />
                            <FormField name="state" as="select" type="" label="State" icon={<MapPinIcon className="w-5 h-5" />} error={errors.state} touched={touched.state}>
                                <option value="">Select State</option>
                                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </FormField>
                        </div>
                    </fieldset>
                    
                     <fieldset className="space-y-5 pt-4">
                        <legend className="text-sm font-semibold text-gray-500 mb-2">Create Password</legend>
                        <FormField name="password" type="password" label="Password" icon={<LockClosedIcon className="w-5 h-5" />} error={errors.password} touched={touched.password} />
                        <FormField name="confirmPassword" type="password" label="Confirm Password" icon={<LockClosedIcon className="w-5 h-5" />} error={errors.confirmPassword} touched={touched.confirmPassword} />
                    </fieldset>

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:bg-primary-300"
                    >
                    {isSubmitting ? <SpinnerIcon className="w-5 h-5" /> : 'Create My Account'}
                    </button>
                </Form>
                )}
            </Formik>

            <div className="text-center">
                <Link to="/register" className="text-sm font-medium text-primary-600 hover:underline flex items-center justify-center">
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    Back to account type selection
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;