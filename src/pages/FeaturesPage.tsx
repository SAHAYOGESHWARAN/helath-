
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    NovoPathLogoIcon,
    DocumentTextIcon,
    CalendarIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    VideoCameraIcon,
    PillIcon,
    ShieldCheckIcon,
    BriefcaseIcon,
} from '@/components/shared/Icons';

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

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <NovoPathLogoIcon className="w-9 h-9" />
                    <span className="text-2xl font-bold text-gray-900">NovoPath Medical Inc</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/features" className="text-sm font-medium text-primary-600 font-bold">Features</Link>
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


const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string, index: number}> = ({ icon, title, description, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    return (
        <div ref={ref} className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 100}ms`}}>
            <div className="bg-white p-8 rounded-2xl shadow-lg h-full border border-gray-100 hover:shadow-primary-100/50 hover:border-primary-200 transition-all fancy-card">
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
        { icon: <DocumentTextIcon className="w-8 h-8" />, title: "Unified EMR System", description: "Access comprehensive patient records, progress notes, and lab results in one secure, easy-to-navigate platform." },
        { icon: <CalendarIcon className="w-8 h-8" />, title: "In-Person & Virtual Visits", description: "Manage your schedule effortlessly with integrated tools for both telehealth consultations and in-person appointments." },
        { icon: <SparklesIcon className="w-8 h-8" />, title: "AI-Powered Health Insights", description: "Leverage Gemini to get quick answers, summarize records, and receive personalized health insights." },
        { icon: <CurrencyDollarIcon className="w-8 h-8" />, title: "Billing and Payments", description: "Simplify your practice's finances with integrated billing, claims, and payment processing tools for a seamless experience." },
        { icon: <PillIcon className="w-8 h-8" />, title: "E-Prescribing", description: "Securely send and manage prescriptions electronically, improving safety and efficiency." },
        { icon: <VideoCameraIcon className="w-8 h-8" />, title: "Secure Telehealth", description: "Conduct high-quality, HIPAA-compliant video calls directly within the platform. No extra software needed." },
        { icon: <BriefcaseIcon className="w-8 h-8" />, title: "Provider Tools", description: "From patient management to analytics, get the tools you need to run your practice smoothly." },
        { icon: <ShieldCheckIcon className="w-8 h-8" />, title: "HIPAA-Compliant", description: "Built from the ground up with security and privacy as a top priority to protect sensitive health information." },
    ];

    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900">A New Standard for Healthcare</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">NovoPath Medical Inc combines cutting-edge technology with a user-centric design to deliver a superior healthcare experience.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 text-left">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">NovoPath Medical Inc</h3>
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
                <p>&copy; {new Date().getFullYear()} NovoPath Medical Inc. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


const FeaturesPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      <Header />
      <main>
        <div className="pt-24">
          <FeaturesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};
  
export default FeaturesPage;