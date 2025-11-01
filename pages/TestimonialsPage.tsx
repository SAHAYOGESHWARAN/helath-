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

// FIX: Populated empty mock data.
const MOCK_TESTIMONIALS = [
    { name: 'Dr. Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=pro1', role: 'Cardiologist, NovoPath Provider', rating: 5, feedback: 'NovoPath has revolutionized my practice. The integrated EMR and telehealth features save me hours every week, allowing me to focus more on patient care.' },
    { name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=pat1', role: 'NovoPath Patient', rating: 5, feedback: 'Managing my appointments and health records has never been easier. The AI assistant is incredibly helpful for understanding my lab results.' },
    { name: 'Dr. David Chen', avatarUrl: 'https://i.pravatar.cc/150?u=pro2', role: 'Dermatologist, NovoPath Provider', rating: 4, feedback: 'The e-prescribing and referral system is seamless. It has significantly reduced administrative overhead for my staff.' },
];

const TestimonialCard: React.FC<{ testimonial: {name: string, avatarUrl: string, role: string, rating: number, feedback: string}, index: number }> = ({ testimonial, index }) => {
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
                    {MOCK_TESTIMONIALS.length > 0 ? (
                        MOCK_TESTIMONIALS.map((t, index) => (
                           <TestimonialCard key={t.name} testimonial={t} index={index} />
                        ))
                    ) : (
                        <div className="md:col-span-3 text-center text-gray-500 py-10">
                            <p>No testimonials to display yet.</p>
                        </div>
                    )}
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