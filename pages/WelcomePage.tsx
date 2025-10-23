import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    NovoPathLogoIcon,
    StarIcon,
    DocumentTextIcon,
    CalendarIcon,
    SparklesIcon,
    ArrowRightIcon,
    BriefcaseIcon,
    UserGroupIcon,
    AcademicCapIcon
} from '../components/shared/Icons';
import { useAuth } from '../hooks/useAuth';

const MOCK_TESTIMONIALS = [
    { name: 'Emily R.', avatarUrl: 'https://i.pravatar.cc/150?u=emily.r', role: 'Patient', rating: 5, feedback: "NovoPath has made managing my family's health records a breeze. The ability to schedule appointments and access lab results from one dashboard is a game-changer." },
    { name: 'Dr. Ben Carter', avatarUrl: 'https://i.pravatar.cc/150?u=ben.c', role: 'Cardiologist', rating: 5, feedback: "As a specialist, coordinating with primary care physicians is crucial. NovoPath's EMR system is intuitive and has significantly improved my workflow and patient care." },
    { name: 'Jessica T.', avatarUrl: 'https://i.pravatar.cc/150?u=jessica.t', role: 'Parent', rating: 5, feedback: "The AI Health Guide is like having a nurse in my pocket. It provides reliable answers quickly, which gives me peace of mind when my kids are sick." },
];

const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);
        
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [ref, options]);

    return [ref, isVisible] as const;
};

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div ref={ref} className={`transition-all duration-1000 ease-in-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
};

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <NovoPathLogoIcon className="w-9 h-9" />
                    <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>NovoPath</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#features" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-200 hover:text-white'}`}>Features</a>
                    <a href="#testimonials" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-200 hover:text-white'}`}>Testimonials</a>
                    <a href="#" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-200 hover:text-white'}`}>For Providers</a>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className={`text-sm font-medium transition-colors ${isScrolled ? 'text-primary-600 hover:text-primary-700' : 'text-white hover:opacity-90'}`}>
                        Sign In
                    </Link>
                    <Link to="/register" className="text-sm font-medium text-white bg-primary-600 px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
};

const HeroSection: React.FC = () => {
    const { user } = useAuth();
    const greeting = user ? `Welcome back, ${user.name}!` : "The Future of Integrated Healthcare is Here";
    
    return (
        <section className="relative bg-gray-900 text-white pt-32 pb-24 md:pt-48 md:pb-32 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <AnimatedSection>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        {greeting}
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        NovoPath is a unified platform connecting patients and providers through a comprehensive EMR, seamless scheduling, and AI-powered health insights.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to={user ? "/dashboard" : "/register/patient"} className="w-full sm:w-auto bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center">
                            I'm a Patient <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </Link>
                        <Link to={user ? "/dashboard" : "/register/provider"} className="w-full sm:w-auto bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center">
                            I'm a Provider <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string, index: number}> = ({ icon, title, description, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    return (
        <div ref={ref} className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 100}ms`}}>
            <div className="bg-white p-8 rounded-2xl shadow-lg h-full border border-gray-100 hover:shadow-primary-100/50 hover:border-primary-200 transition-all">
                <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};

const FeaturesSection: React.FC = () => {
    const features = [
        { icon: <DocumentTextIcon className="w-8 h-8" />, title: "Unified EMR System", description: "A complete electronic medical record system designed for modern healthcare operations, ensuring all patient data is accessible and secure." },
        { icon: <CalendarIcon className="w-8 h-8" />, title: "In-Person & Virtual Visits", description: "Seamlessly schedule and manage both in-person and virtual appointments, providing flexibility for patients and providers." },
        { icon: <SparklesIcon className="w-8 h-8" />, title: "AI-Powered Health Insights", description: "Leverage our intelligent AI to get quick answers to health questions and personalized insights based on your medical history." },
    ];

    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-900">A New Standard for Healthcare</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">NovoPath combines cutting-edge technology with a user-centric design to deliver a superior healthcare experience.</p>
                </AnimatedSection>
                <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatsSection: React.FC = () => (
    <AnimatedSection className="bg-white py-20">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-5xl font-extrabold text-primary-600">10,000+</p>
                    <p className="mt-2 text-lg font-medium text-gray-700">Active Patients</p>
                </div>
                <div>
                    <p className="text-5xl font-extrabold text-primary-600">500+</p>
                    <p className="mt-2 text-lg font-medium text-gray-700">Verified Providers</p>
                </div>
                <div>
                    <p className="text-5xl font-extrabold text-primary-600">98%</p>
                    <p className="mt-2 text-lg font-medium text-gray-700">Patient Satisfaction</p>
                </div>
            </div>
        </div>
    </AnimatedSection>
);

const TestimonialCard: React.FC<{ testimonial: typeof MOCK_TESTIMONIALS[0], index: number }> = ({ testimonial, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    return(
        <div ref={ref} className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 100}ms`}}>
            <div className="flex items-center mb-4">
                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-14 h-14 rounded-full shadow-md" />
                <div className="ml-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-primary-600 font-medium">{testimonial.role}</p>
                </div>
            </div>
            <div className="flex mb-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`} />)}
            </div>
            <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
        </div>
    );
};

const TestimonialsSection: React.FC = () => {
    return(
        <section id="testimonials" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-900">Loved by Patients and Professionals</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Discover why thousands of users trust NovoPath for their healthcare needs.</p>
                </AnimatedSection>
                <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
                    {MOCK_TESTIMONIALS.map((t, index) => (
                       <TestimonialCard key={t.name} testimonial={t} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCtaSection: React.FC = () => (
    <AnimatedSection className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center bg-primary-600 rounded-2xl py-16 text-white" style={{backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.9), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1556761175-577380e25948?q=80&w=2070&auto=format&fit=crop)'}}>
            <h2 className="text-4xl font-bold">Start Your Journey to Better Health Today</h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">Create an account in minutes and take the first step towards a more connected and empowered healthcare experience.</p>
            <div className="mt-8">
                <Link to="/register" className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl text-lg">
                    Sign Up Now
                </Link>
            </div>
        </div>
    </AnimatedSection>
);

const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-white">
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
                        <li><a href="/login" className="hover:text-white">Find a Doctor</a></li>
                        <li><a href="/login" className="hover:text-white">Book Appointment</a></li>
                        <li><a href="/login" className="hover:text-white">My Records</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">For Providers</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="/login" className="hover:text-white">Platform Overview</a></li>
                        <li><a href="/login" className="hover:text-white">EMR System</a></li>
                        <li><a href="/login" className="hover:text-white">Pricing</a></li>
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
    </footer>
);


const WelcomePage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen font-sans antialiased">
            <Header />
            <main>
                <HeroSection />
                <StatsSection />
                <FeaturesSection />
                <TestimonialsSection />
                <FinalCtaSection />
            </main>
            <Footer />
        </div>
    );
};

export default WelcomePage;