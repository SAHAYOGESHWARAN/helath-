"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Icons_1 = require("../../components/shared/Icons");
var RoleSelectionCard = function (_a) {
    var to = _a.to, icon = _a.icon, title = _a.title, description = _a.description, buttonText = _a.buttonText;
    return (<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-primary-100 text-primary-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-8 flex-grow">{description}</p>
            <react_router_dom_1.Link to={to} className="w-full bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all shadow-md">
                {buttonText}
            </react_router_dom_1.Link>
        </div>);
};
var RegisterPage = function () {
    return (<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <react_router_dom_1.Link to="/" className="inline-block mb-6">
                <Icons_1.NovoPathLogoIcon className="w-12 h-12 text-primary-600"/>
            </react_router_dom_1.Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Join NovoPath</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Choose your account type to get started on your personalized healthcare journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <RoleSelectionCard to="/register/patient" icon={<Icons_1.UserIcon className="w-10 h-10"/>} title="For Patients" description="Manage your health records, schedule appointments, and access AI-powered health insights." buttonText="Create Patient Account"/>
            <RoleSelectionCard to="/register/provider" icon={<Icons_1.BriefcaseIcon className="w-10 h-10"/>} title="For Providers" description="Join our network to streamline your practice, connect with patients, and utilize our modern EMR system." buttonText="Create Provider Account"/>
             <RoleSelectionCard to="/register/admin" icon={<Icons_1.CogIcon className="w-10 h-10"/>} title="For Admins" description="Manage users, subscriptions, and system settings for the NovoPath platform." buttonText="Create Admin Account"/>
        </div>

        <div className="text-center mt-12">
            <p className="text-gray-600">
                Already have an account?{' '}
                <react_router_dom_1.Link to="/login" className="font-semibold text-primary-600 hover:underline">
                    Sign In Here
                </react_router_dom_1.Link>
            </p>
        </div>
      </div>
    </div>);
};
exports.default = RegisterPage;
