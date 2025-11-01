"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Icons_1 = require("../components/shared/Icons");
var useOnScreen = function (options) {
    var ref = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)(false), isVisible = _a[0], setIsVisible = _a[1];
    (0, react_1.useEffect)(function () {
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);
        var currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return function () {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);
    return [ref, isVisible];
};
var AnimatedSection = function (_a) {
    var children = _a.children, className = _a.className;
    var _b = useOnScreen({ threshold: 0.1 }), ref = _b[0], isVisible = _b[1];
    return (<div ref={ref} className={"transition-all duration-1000 ease-in-out ".concat(className, " ").concat(isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
            {children}
        </div>);
};
var Header = function () {
    return (<header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <react_router_dom_1.Link to="/" className="flex items-center space-x-2">
                    <Icons_1.NovoPathLogoIcon className="w-9 h-9"/>
                    <span className="text-2xl font-bold text-gray-900">NovoPath</span>
                </react_router_dom_1.Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <react_router_dom_1.Link to="/features" className="text-sm font-medium text-gray-600 hover:text-primary-600">Features</react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/testimonials" className="text-sm font-medium text-gray-600 hover:text-primary-600">Testimonials</react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/for-providers" className="text-sm font-medium text-gray-600 hover:text-primary-600">For Providers</react_router_dom_1.Link>
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
var WelcomePage = function () {
    return (<div className="bg-white min-h-screen font-sans antialiased">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 -translate-x-1/4 -translate-y-1/4 animate-[floating_15s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200 rounded-full opacity-30 translate-x-1/4 translate-y-1/4 animate-[floating_12s_ease-in-out_infinite_3s]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <AnimatedSection>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight gradient-text">
                        Intelligent Healthcare,
                        <br />
                        Seamlessly Connected.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        NovoPath is an intelligent, connected platform that empowers both patients and providers with seamless tools for a healthier tomorrow.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <react_router_dom_1.Link to="/register" className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl inline-flex items-center">
                            Get Started Free <Icons_1.ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </react_router_dom_1.Link>
                        <react_router_dom_1.Link to="/features" className="font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all">
                            Learn More
                        </react_router_dom_1.Link>
                    </div>
                </AnimatedSection>
            </div>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Icons_1.ArrowDownIcon className="w-6 h-6 text-gray-400 scroll-indicator"/>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
            <div className="container mx-auto px-6">
                <AnimatedSection className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">A simple, three-step journey to better health management.</p>
                </AnimatedSection>

                <div className="grid md:grid-cols-3 gap-12 mt-16 text-center">
                    <AnimatedSection>
                        <div className="flex justify-center mb-5"><div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><Icons_1.UserCircleIcon className="w-8 h-8"/></div></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">1. Connect</h3>
                        <p className="text-gray-600">Create your secure account as a patient or provider in minutes.</p>
                    </AnimatedSection>
                     <AnimatedSection>
                        <div className="flex justify-center mb-5"><div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><Icons_1.BriefcaseIcon className="w-8 h-8"/></div></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">2. Consult</h3>
                        <p className="text-gray-600">Schedule appointments, manage records, and connect via secure telehealth.</p>
                    </AnimatedSection>
                     <AnimatedSection>
                        <div className="flex justify-center mb-5"><div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><Icons_1.CogIcon className="w-8 h-8"/></div></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">3. Control</h3>
                        <p className="text-gray-600">Take control of your health with AI insights, goal tracking, and streamlined billing.</p>
                    </AnimatedSection>
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary-600">
            <div className="container mx-auto px-6 text-center">
                 <AnimatedSection>
                    <h2 className="text-3xl font-bold text-white">Ready to Transform Your Healthcare Experience?</h2>
                    <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">Join NovoPath today and discover a smarter way to manage health.</p>
                    <div className="mt-8">
                        <react_router_dom_1.Link to="/register" className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-primary-50 transition-all transform hover:scale-105 shadow-2xl">
                            Sign Up Now
                        </react_router_dom_1.Link>
                    </div>
                </AnimatedSection>
            </div>
        </section>
      </main>
      <Footer />
    </div>);
};
exports.default = WelcomePage;
