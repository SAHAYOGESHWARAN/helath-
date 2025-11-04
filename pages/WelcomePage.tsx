
import React, { useRef, useEffect, useState } from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
import {
    NovoPathLogoIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    SparklesIcon,
    ShieldCheckIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    CheckCircleIcon,
} from '../components/shared/Icons';

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
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
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
    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <NovoPathLogoIcon className="w-9 h-9" />
                    <span className="text-2xl font-bold text-gray-900">NovoPath</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-primary-600">Features</Link>
                    <Link to="/testimonials" className="text-sm font-medium text-gray-600 hover:text-primary-600">Testimonials</Link>
                    <Link to="/for-providers" className="text-sm font-medium text-gray-600 hover:text-primary-600">For Providers</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
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

const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">NovoPath</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/features" className="hover:text-white">Features</Link></li>
                        <li><Link to="/testimonials" className="hover:text-white">Testimonials</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">For Patients</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/login" className="hover:text-white">Patient Login</Link></li>
                        <li><Link to="/register/patient" className="hover:text-white">Sign Up</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">For Providers</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/for-providers" className="hover:text-white">Platform Overview</Link></li>
                        <li><Link to="/register/provider" className="hover:text-white">Join Network</Link></li>
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

const FeatureHighlightCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="text-center p-6">
        <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center feature-icon">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const WelcomePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 -translate-x-1/4 -translate-y-1/4 animate-[floating_15s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200 rounded-full opacity-30 translate-x-1/4 translate-y-1/4 animate-[floating-alt_12s_ease-in-out_infinite_3s]"></div>
            <div className="absolute bottom-1/2 left-1/4 w-48 h-48 bg-primary-200 rounded-full opacity-20 animate-[floating_18s_ease-in-out_infinite_1s]"></div>

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
                        <Link to="/register" className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl inline-flex items-center">
                            Get Started Free <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </Link>
                        <Link to="/features" className="font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all">
                            Learn More
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <ArrowDownIcon className="w-6 h-6 text-gray-400 scroll-indicator"/>
            </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <AnimatedSection className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">The Future of Personalized Health</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">One platform for every aspect of your healthcare journey.</p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    <AnimatedSection>
                        <FeatureHighlightCard icon={<SparklesIcon className="w-8 h-8"/>} title="AI-Powered Insights" description="Leverage Gemini to understand health data, get summaries, and ask questions." />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureHighlightCard icon={<VideoCameraIcon className="w-8 h-8"/>} title="Seamless Telehealth" description="Connect with your provider through secure, integrated video consultations." />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureHighlightCard icon={<DocumentTextIcon className="w-8 h-8"/>} title="Unified Records" description="Access all your appointments, lab results, and notes in one organized place." />
                    </AnimatedSection>
                    <AnimatedSection>
                        <FeatureHighlightCard icon={<ShieldCheckIcon className="w-8 h-8"/>} title="Secure & Compliant" description="Built on a foundation of security and HIPAA compliance to protect your data." />
                    </AnimatedSection>
                </div>
            </div>
        </section>

        {/* Feature Spotlight: For Patients */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <AnimatedSection>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <span className="text-primary-600 font-semibold uppercase tracking-wider">For Patients</span>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">Take Control of Your Health Journey</h3>
                            <p className="mt-4 text-gray-600">NovoPath gives you direct access to your health information and care team. Schedule appointments, view results, and get personalized insights, all from one secure app.</p>
                            <ul className="mt-6 space-y-3 text-left">
                                <li className="flex items-start">
                                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                                    <span>Easily book and manage both virtual and in-person appointments with your providers.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                                    <span>Get summaries of your health records powered by Gemini, making complex information easy to understand.</span>
                                </li>
                            </ul>
                            <Link to="/register/patient" className="mt-8 inline-block bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-all">Sign Up as a Patient</Link>
                        </div>
                         <div className="relative h-96">
                            <div className="absolute inset-0 bg-primary-100 rounded-3xl transform -rotate-3"></div>
                            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" alt="Patient using tablet" className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300" />
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WelcomePage;