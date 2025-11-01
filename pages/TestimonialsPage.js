"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
                    <react_router_dom_1.Link to="/features" className="text-sm font-medium text-gray-600 hover:text-primary-600">Features</react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/testimonials" className="text-sm font-medium text-primary-600 font-bold">Testimonials</react_router_dom_1.Link>
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
// FIX: Populated empty mock data.
var MOCK_TESTIMONIALS = [
    { name: 'Dr. Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=pro1', role: 'Cardiologist, NovoPath Provider', rating: 5, feedback: 'NovoPath has revolutionized my practice. The integrated EMR and telehealth features save me hours every week, allowing me to focus more on patient care.' },
    { name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=pat1', role: 'NovoPath Patient', rating: 5, feedback: 'Managing my appointments and health records has never been easier. The AI assistant is incredibly helpful for understanding my lab results.' },
    { name: 'Dr. David Chen', avatarUrl: 'https://i.pravatar.cc/150?u=pro2', role: 'Dermatologist, NovoPath Provider', rating: 4, feedback: 'The e-prescribing and referral system is seamless. It has significantly reduced administrative overhead for my staff.' },
];
var TestimonialCard = function (_a) {
    var testimonial = _a.testimonial, index = _a.index;
    var _b = useOnScreen({ threshold: 0.2 }), ref = _b[0], isVisible = _b[1];
    return (<div ref={ref} className={"bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col transition-all duration-700 ease-out transform relative fancy-card ".concat(isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')} style={{ transitionDelay: "".concat(index * 100, "ms") }}>
            <Icons_1.QuoteIcon className="absolute top-4 left-4 w-16 h-16 text-primary-50"/>
            <div className="flex items-center mb-4 relative z-10">
                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-14 h-14 rounded-full shadow-md"/>
                <div className="ml-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-primary-600 font-medium">{testimonial.role}</p>
                </div>
            </div>
            <div className="flex mb-4 relative z-10">
                {__spreadArray([], Array(5), true).map(function (_, i) { return <Icons_1.StarIcon key={i} className={"w-5 h-5 ".concat(i < testimonial.rating ? 'text-amber-400' : 'text-gray-300')}/>; })}
            </div>
            <p className="text-gray-600 italic relative z-10">"{testimonial.feedback}"</p>
        </div>);
};
var TestimonialsSection = function () {
    return (<section id="testimonials" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-900">Loved by Patients and Professionals</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Hear from healthcare professionals and patients who trust NovoPath.</p>
                </AnimatedSection>
                <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
                    {MOCK_TESTIMONIALS.length > 0 ? (MOCK_TESTIMONIALS.map(function (t, index) { return (<TestimonialCard key={t.name} testimonial={t} index={index}/>); })) : (<div className="md:col-span-3 text-center text-gray-500 py-10">
                            <p>No testimonials to display yet.</p>
                        </div>)}
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
var TestimonialsPage = function () {
    return (<div className="bg-white min-h-screen font-sans antialiased">
      <Header />
      <main>
        <div className="pt-24">
          <TestimonialsSection />
        </div>
      </main>
      <Footer />
    </div>);
};
exports.default = TestimonialsPage;
