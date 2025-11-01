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
    return (<header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <react_router_dom_1.Link to="/" className="flex items-center space-x-2">
                    <Icons_1.NovoPathLogoIcon className="w-9 h-9"/>
                    <span className="text-2xl font-bold text-gray-900">NovoPath</span>
                </react_router_dom_1.Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <react_router_dom_1.Link to="/features" className="text-sm font-medium text-primary-600 font-bold">Features</react_router_dom_1.Link>
                    <a href="/#testimonials" className="text-sm font-medium text-gray-600 hover:text-primary-600">Testimonials</a>
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600">For Providers</a>
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
var FeatureCard = function (_a) {
    var icon = _a.icon, title = _a.title, description = _a.description, index = _a.index;
    var _b = useOnScreen({ threshold: 0.2 }), ref = _b[0], isVisible = _b[1];
    return (<div ref={ref} className={"transition-all duration-700 ease-out transform ".concat(isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')} style={{ transitionDelay: "".concat(index * 100, "ms") }}>
            <div className="bg-white p-8 rounded-2xl shadow-lg h-full border border-gray-100 hover:shadow-primary-100/50 hover:border-primary-200 transition-all fancy-card">
                <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>);
};
var FeaturesSection = function () {
    var features = [
        { icon: <Icons_1.DocumentTextIcon className="w-8 h-8"/>, title: "Unified EMR System", description: "Access comprehensive patient records, progress notes, and lab results in one secure, easy-to-navigate platform." },
        { icon: <Icons_1.CalendarIcon className="w-8 h-8"/>, title: "In-Person & Virtual Visits", description: "Manage your schedule effortlessly with integrated tools for both telehealth consultations and in-person appointments." },
        { icon: <Icons_1.SparklesIcon className="w-8 h-8"/>, title: "AI-Powered Health Insights", description: "Leverage Gemini to get quick answers, summarize records, and receive personalized health insights." },
        { icon: <Icons_1.CurrencyDollarIcon className="w-8 h-8"/>, title: "Billing and Payments", description: "Simplify your practice's finances with integrated billing, claims, and payment processing tools for a seamless experience." },
    ];
    return (<section id="features" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-900">A New Standard for Healthcare</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">NovoPath combines cutting-edge technology with a user-centric design to deliver a superior healthcare experience.</p>
                </AnimatedSection>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 text-left">
                    {features.map(function (feature, index) { return (<FeatureCard key={index} {...feature} index={index}/>); })}
                </div>
            </div>
        </section>);
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
                        <li><react_router_dom_1.Link to="/login" className="hover:text-white">Platform Overview</react_router_dom_1.Link></li>
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
var FeaturesPage = function () {
    return (<div className="bg-white min-h-screen font-sans antialiased">
      <Header />
      <main>
        <div className="pt-24">
          <FeaturesSection />
        </div>
      </main>
      <Footer />
    </div>);
};
exports.default = FeaturesPage;
