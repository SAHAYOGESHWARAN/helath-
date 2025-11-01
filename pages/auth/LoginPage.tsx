"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var formik_1 = require("formik");
var Yup = require("yup");
var useAuth_1 = require("../../hooks/useAuth");
var Icons_1 = require("../../components/shared/Icons");
var App_1 = require("../../App");
var LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});
var LoginPage = function () {
    var login = (0, useAuth_1.useAuth)().login;
    var showToast = (0, App_1.useApp)().showToast;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
            <react_router_dom_1.Link to="/" className="inline-block mb-4">
                <Icons_1.NovoPathLogoIcon className="w-10 h-10 text-primary-600"/>
            </react_router_dom_1.Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-gray-600">Welcome back to NovoPath.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <formik_1.Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={function (values_1, _a) { return __awaiter(void 0, [values_1, _a], void 0, function (values, _b) {
            var success;
            var setSubmitting = _b.setSubmitting;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, login(values.email, values.password)];
                    case 1:
                        success = _c.sent();
                        if (success) {
                            // Navigate will be handled by the AppRoutes component upon user state change.
                            // navigate('/dashboard');
                        }
                        else {
                            showToast('Invalid credentials. Please try again.', 'error');
                        }
                        setSubmitting(false);
                        return [2 /*return*/];
                }
            });
        }); }}>
            {function (_a) {
            var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form className="space-y-6">
                <div>
                    <label htmlFor="email-login" className="sr-only">Email Address</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Icons_1.EnvelopeIcon className="w-5 h-5"/>
                        </span>
                        <formik_1.Field type="email" name="email" id="email-login" placeholder="Email Address" className={"w-full pl-10 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ".concat(errors.email && touched.email ? 'border-red-500 ring-red-500' : 'border-gray-300')}/>
                    </div>
                    <formik_1.ErrorMessage name="email" component="p" className="text-red-600 text-xs mt-1 pl-1"/>
                </div>
                 <div>
                    <label htmlFor="password-login" className="sr-only">Password</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Icons_1.LockClosedIcon className="w-5 h-5"/>
                        </span>
                        <formik_1.Field type="password" name="password" id="password-login" placeholder="Password" className={"w-full pl-10 pr-3 py-3 border bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ".concat(errors.password && touched.password ? 'border-red-500 ring-red-500' : 'border-gray-300')}/>
                    </div>
                     <formik_1.ErrorMessage name="password" component="p" className="text-red-600 text-xs mt-1 pl-1"/>
                </div>
                 <button type="submit" disabled={isSubmitting} className="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-md px-5 py-3 text-center transition-all disabled:bg-primary-300 flex items-center justify-center">
                  {isSubmitting ? <Icons_1.SpinnerIcon /> : 'Sign In'}
                </button>
              </formik_1.Form>);
        }}
          </formik_1.Formik>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <react_router_dom_1.Link to="/register" className="font-semibold text-primary-600 hover:underline">
                Sign up
              </react_router_dom_1.Link>
            </p>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = LoginPage;
