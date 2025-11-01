"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Icons_1 = require("../components/shared/Icons");
var Header = function () {
    return (<header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <react_router_dom_1.Link to="/" className="flex items-center space-x-2">
                    <Icons_1.NovoPathLogoIcon className="w-9 h-9"/>
                    <span className="text-2xl font-bold text-gray-900">NovoPath</span>
                </react_router_dom_1.Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <react_router_dom_1.Link to="/features" className="text-sm font-medium text-gray-600 hover:text-primary-600">Features</react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/testimonials" className="text-sm font-medium text-gray-600 hover:text-primary-600">Testimonials</react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/for-providers" className="text-sm font-medium text-primary-600 font-bold">For Providers</react_router_dom_1.Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <react_router_dom_1.Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        Sign In
                    </react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/register" className="text-sm font-medium text-white bg-primary-600 px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg">
                        Get Started
                    </react_router_dom_1.Link>
                </div>
            </div>
        </header>);
};
var Footer = function () { return (<footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">NovoPath</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">For Patients</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><react_router_dom_1.Link to="/login" className="hover:text-white">Find a Doctor</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/login" className="hover:text-white">Book Appointment</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/login" className="hover:text-white">My Records</react_router_dom_1.Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">For Providers</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><react_router_dom_1.Link to="/for-providers" className="hover:text-white">Platform Overview</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/login" className="hover:text-white">EMR System</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/login" className="hover:text-white">Pricing</react_router_dom_1.Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
                <p>&copy; {new Date().getFullYear()} NovoPath Medical. All Rights Reserved.</p>
            </div>
        </div>
    </footer>); };
var ProviderFeaturesSection = function () {
    var features = [
        { icon: <Icons_1.DocumentTextIcon className="w-8 h-8"/>, title: "Intelligent EMR", description: "Spend less time on paperwork with our AI-assisted EMR. Draft notes, summarize patient history, and find information instantly." },
        { icon: <Icons_1.CalendarIcon className="w-8 h-8"/>, title: "Seamless Scheduling", description: "Manage your calendar, set availability, and reduce no-shows with automated reminders for both in-person and virtual visits." },
        { icon: <Icons_1.VideoCameraIcon className="w-8 h-8"/>, title: "Integrated Telehealth", description: "Conduct secure, high-quality video consultations directly within the platform. No extra software needed." },
        { icon: <Icons_1.CurrencyDollarIcon className="w-8 h-8"/>, title: "Automated Billing & Claims", description: "Streamline your revenue cycle with automated superbill creation, claim submission, and payment processing." },
    ];
    return (<section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900">Designed for Modern Practices</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">NovoPath provides the tools you need to deliver exceptional care and run your practice efficiently.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 text-left">
                    {features.map(function (feature, index) { return (<div key={index} className="bg-white p-8 rounded-2xl shadow-lg h-full border border-gray-100 hover:shadow-primary-100/50 hover:border-primary-200 transition-all fancy-card">
                            <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>); })}
                </div>
            </div>
        </section>);
};
var ForProvidersPage = function () {
    return (<div className="bg-white min-h-screen font-sans antialiased">
      <Header />
      <main>
        <section className="relative bg-gray-800 text-white pt-32 pb-24 md:pt-48 md:pb-32 flex items-center justify-center text-center">
             <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-800/80 to-transparent"></div>
            <div className="container mx-auto px-6 relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Empower Your Practice with NovoPath
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    A smarter, faster, and more connected way to manage your patients and your practice.
                </p>
                <div className="mt-10">
                    <react_router_dom_1.Link to="/register/provider" className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl inline-flex items-center">
                        Join as a Provider <Icons_1.ArrowRightIcon className="w-5 h-5 ml-2"/>
                    </react_router_dom_1.Link>
                </div>
            </div>
        </section>
        <ProviderFeaturesSection />
      </main>
      <Footer />
    </div>);
};
exports.default = ForProvidersPage;
