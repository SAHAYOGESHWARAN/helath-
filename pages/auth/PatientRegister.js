"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var formik_1 = require("formik");
var Yup = require("yup");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var Icons_1 = require("../../components/shared/Icons");
var constants_1 = require("../../constants");
var PatientRegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name is too short').max(50, 'Name is too long').required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    dob: Yup.date().max(new Date(), "Date of birth cannot be in the future").required('Date of birth is required'),
    state: Yup.string().required('State is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password needs a mix of uppercase, lowercase, numbers, and special characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords do not match')
        .required('You must confirm your password'),
});
var FormField = function (_a) {
    var name = _a.name, type = _a.type, label = _a.label, icon = _a.icon, as = _a.as, children = _a.children, error = _a.error, touched = _a.touched;
    return (<div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 sr-only">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {icon}
            </span>
            <formik_1.Field as={as} type={type} name={name} placeholder={label} className={"w-full pl-10 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ".concat(error && touched ? 'border-red-500 ring-red-500' : 'border-gray-300')}>
                {children}
            </formik_1.Field>
        </div>
        <formik_1.ErrorMessage name={name} component="p" className="text-red-600 text-xs mt-1 pl-1"/>
    </div>);
};
var PatientRegister = function () {
    var register = (0, useAuth_1.useAuth)().register;
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
            <react_router_dom_1.Link to="/" className="inline-block mb-4">
                <Icons_1.NovoPathLogoIcon className="w-10 h-10 text-primary-600"/>
            </react_router_dom_1.Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Create Your Patient Account</h1>
            <p className="mt-2 text-gray-600">Begin your journey to better health management.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <formik_1.Formik initialValues={{ name: '', email: '', dob: '', state: '', password: '', confirmPassword: '' }} validationSchema={PatientRegisterSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting;
            register({ name: values.name, email: values.email, dob: values.dob, state: values.state, password: values.password }, types_1.UserRole.PATIENT);
            setSubmitting(false);
        }}>
            {function (_a) {
            var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form className="space-y-5">
                <FormField name="name" type="text" label="Full Name" icon={<Icons_1.UserIcon className="w-5 h-5"/>} error={errors.name} touched={touched.name}/>
                <FormField name="email" type="email" label="Email Address" icon={<Icons_1.EnvelopeIcon className="w-5 h-5"/>} error={errors.email} touched={touched.email}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="dob" type="date" label="Date of Birth" icon={<Icons_1.CalendarIcon className="w-5 h-5"/>} error={errors.dob} touched={touched.dob}/>
                    <FormField name="state" as="select" type="" label="State" icon={<Icons_1.MapPinIcon className="w-5 h-5"/>} error={errors.state} touched={touched.state}>
                        <option value="">Select State</option>
                        {constants_1.US_STATES.map(function (s) { return <option key={s} value={s}>{s}</option>; })}
                    </FormField>
                </div>

                <FormField name="password" type="password" label="Password" icon={<Icons_1.LockClosedIcon className="w-5 h-5"/>} error={errors.password} touched={touched.password}/>
                <FormField name="confirmPassword" type="password" label="Confirm Password" icon={<Icons_1.LockClosedIcon className="w-5 h-5"/>} error={errors.confirmPassword} touched={touched.confirmPassword}/>

                <button type="submit" disabled={isSubmitting} className="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-md px-5 py-3 text-center transition-all disabled:bg-primary-300 flex items-center justify-center">
                  {isSubmitting ? <Icons_1.SpinnerIcon /> : 'Sign Up & Continue'}
                </button>
              </formik_1.Form>);
        }}
          </formik_1.Formik>
        </div>

        <div className="mt-8 text-center">
          <react_router_dom_1.Link to="/register" className="text-sm font-medium text-primary-600 hover:underline flex items-center justify-center">
              <Icons_1.ChevronLeftIcon className="w-4 h-4 mr-1"/>
              Back to account type selection
          </react_router_dom_1.Link>
        </div>
      </div>
    </div>);
};
exports.default = PatientRegister;
