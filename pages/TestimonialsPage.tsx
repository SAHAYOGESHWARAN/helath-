import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    NovoPathLogoIcon,
    StarIcon,
    QuoteIcon,
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
        <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <NovoPathLogoIcon className="w-9 h-9" />
                    <span className="text-2xl font-bold text-gray-900">NovoPath</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-primary-600">Features</Link>
                    <Link to="/testimonials" className="text-sm font-medium text-primary-600 font-bold">Testimonials</Link>
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

const MOCK_TESTIMONIALS = [
    { name: 'Emily R.', avatarUrl: 'https://i.pravatar.cc/150?u=emily.r', role: 'Patient', rating: 5, feedback: "NovoPath has made managing my family's health records a breeze. The ability to schedule appointments and access lab results from one dashboard is a game-changer." },
    { name: 'Dr. Ben Carter', avatarUrl: 'https://i.pravatar.cc/150?u=ben.c', role: 'Cardiologist', rating: 5, feedback: "As a specialist, coordinating with primary care physicians is crucial. NovoPath's EMR system is intuitive and has significantly improved my workflow and patient care." },
    { name: 'Jessica T.', avatarUrl: 'https://i.pravatar.cc/150?u=jessica.t', role: 'Parent', rating: 5, feedback: "The AI Health Guide is like having a nurse in my pocket. It provides reliable answers quickly, which gives me peace of mind when my kids are sick." },
];

const TestimonialCard: React.FC<{ testimonial: typeof MOCK_TESTIMONIALS[0], index: number }> = ({ testimonial, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    return(
        <div ref={ref} className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col transition-all duration-700 ease-out transform relative fancy-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 100}ms`}}>
            <QuoteIcon className="absolute top-4 left-4 w-16 h-16 text-primary-50" />
            <div className="flex items-center mb-4 relative z-10">
                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-14 h-14 rounded-full shadow-md" />
                <div className="ml-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-primary-600 font-medium">{testimonial.role}</p>
                </div>
            </div>
            <div className="flex mb-4 relative z-10">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`} />)}
            </div>
            <p className="text-gray-600 italic relative z-10">"{testimonial.feedback}"</p>
        </div>
    );
};

const TestimonialsSection: React.FC = () => {
    return(
        <section id="testimonials" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-900">Loved by Patients and Professionals</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Hear from healthcare professionals and patients who trust NovoPath.</p>
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
                        <li><Link to="/login" className="hover:text-white">Find a Doctor</Link></li>
                        <li><Link to="/login" className="hover:text-white">Book Appointment</Link></li>
                        <li><Link to="/login" className="hover:text-white">My Records</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">For Providers</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/for-providers" className="hover:text-white">Platform Overview</Link></li>
                        <li><Link to="/login" className="hover:text-white">EMR System</Link></li>
                        <li><Link to="/login" className="hover:text-white">Pricing</Link></li>
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

const TestimonialsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      <Header />
      <main>
        <div className="pt-24">
          <TestimonialsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};
  
export default TestimonialsPage;
