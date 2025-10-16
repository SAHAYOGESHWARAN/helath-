import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { NovoPathLogoIcon, StarIcon, DocumentTextIcon, CalendarIcon, SparklesIcon, ChevronDownIcon } from '../components/shared/Icons';
import { useAuth } from '../hooks/useAuth';

// --- Mock Data ---
const MOCK_TESTIMONIALS = [
    { name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/150?u=sarah.l', rating: 5, feedback: "NovoPath has revolutionized how I manage my health. Everything is in one place, and the AI assistant is incredibly helpful for quick questions." },
    { name: 'David C.', avatarUrl: 'https://i.pravatar.cc/150?u=david.c', rating: 5, feedback: "As a provider, this platform has saved me hours of administrative work. The patient management and e-prescribing tools are top-notch." },
    { name: 'Maria G.', avatarUrl: 'https://i.pravatar.cc/150?u=maria.g', rating: 4, feedback: "Booking appointments and seeing my lab results has never been easier. I wish the mobile app had a few more features, but overall it's a fantastic tool." },
];

// --- Custom Hook for Scroll Animations ---
const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (ref.current) observer.unobserve(ref.current);
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

// --- Sub-components for Sections ---

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div ref={ref} className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {children}
        </div>
    );
};

const Header: React.FC = () => (
    <header className="absolute top-0 left-0 right-0 z-20 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
                <NovoPathLogoIcon className="w-8 h-8" />
                <span className="text-2xl font-bold text-gray-800">NovoPath</span>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
                <div className="hidden md:block border-l h-6 border-gray-300"></div>
                <Link to="/login" className="hidden md:block text-md font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    Sign In
                </Link>
                <Link to="/register" className="text-md font-medium text-white bg-primary-600 px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                    Get Started
                </Link>
            </div>
        </div>
    </header>
);

const HeroSection: React.FC = () => {
    const { user } = useAuth();
    const greeting = user ? `Welcome back, ${user.name}!` : "Pioneering the Future of Personalized Health";
    
    return (
        <section className="relative flex-grow flex items-center justify-center text-center py-40">
            <div className="container mx-auto px-6 relative z-10">
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight animate-text-focus-in gradient-text drop-shadow-sm">
                    {greeting}
                </h1>
                <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
                    An intelligent, connected platform that empowers both patients and providers with seamless tools for a healthier tomorrow.
                </p>
                <div className="mt-10 flex items-center justify-center space-x-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <Link to={user ? "/dashboard" : "/register"} className="bg-gradient-to-r from-primary-600 to-accent text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
                        {user ? "Go to Dashboard" : "Create a Free Account"}
                    </Link>
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in" style={{ animationDelay: '1000ms' }}>
                <div className="scroll-indicator text-gray-400">
                    <ChevronDownIcon className="w-8 h-8" />
                </div>
            </div>
        </section>
    );
};

const StaggeredFeatureSection: React.FC = () => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    const features = [
        { icon: <DocumentTextIcon className="w-12 h-12 text-primary-600 mx-auto" />, title: "Centralized EMR", description: "Access and manage your complete health history, from lab results to medications, securely and conveniently." },
        { icon: <CalendarIcon className="w-12 h-12 text-primary-600 mx-auto" />, title: "Effortless Scheduling", description: "Book, manage, and attend appointments—both in-person and virtual—with just a few clicks." },
        { icon: <SparklesIcon className="w-12 h-12 text-primary-600 mx-auto" />, title: "AI Health Guide", description: "Get instant, reliable information about symptoms and health questions from our intelligent AI assistant." },
    ];

    return (
        <div ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-800">Everything You Need, All in One Place</h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">NovoPath simplifies healthcare management by integrating essential tools into a single, intuitive platform.</p>
                </AnimatedSection>
                <div className={`grid md:grid-cols-3 gap-8 mt-12`}>
                    {features.map((feature, index) => (
                         <div key={index} className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="fancy-card bg-gray-50 p-8 rounded-xl border border-gray-200 h-full">
                                {feature.icon}
                                <h3 className="text-xl font-semibold mt-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TestimonialCard: React.FC<{ testimonial: typeof MOCK_TESTIMONIALS[0] }> = ({ testimonial }) => (
    <div className="fancy-card testimonial-card relative bg-white p-6 rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="relative z-10">
            <div className="flex items-center mb-4">
                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`} />)}
                    </div>
                </div>
            </div>
            <p className="text-gray-600 text-sm flex-grow">"{testimonial.feedback}"</p>
        </div>
    </div>
);

const TestimonialsSection: React.FC = () => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return(
        <div ref={ref} className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 text-center">
                 <AnimatedSection>
                    <h2 className="text-4xl font-bold text-gray-800">Trusted by Patients and Providers</h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Hear what our users are saying about the NovoPath experience.</p>
                </AnimatedSection>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                    {MOCK_TESTIMONIALS.map((t, index) => (
                        <div key={t.name} className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                           <TestimonialCard testimonial={t} />
                        </div>
                    ))}
                </div>
                <AnimatedSection>
                    <button className="mt-12 text-sm font-semibold text-primary-600 hover:underline">Write a Review &rarr;</button>
                </AnimatedSection>
            </div>
        </div>
    );
};

const FinalCtaSection: React.FC = () => (
    <AnimatedSection className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Ready to Take Control of Your Health?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Join thousands of users who are experiencing a smarter, simpler way to manage their healthcare journey.</p>
            <div className="mt-8">
                <Link to="/register" className="bg-gradient-to-r from-primary-600 to-accent text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg">
                    Get Started for Free
                </Link>
            </div>
        </div>
    </AnimatedSection>
);

const Footer: React.FC = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-3">
                    <NovoPathLogoIcon className="w-8 h-8"/>
                    <span className="text-xl font-bold text-gray-200">NovoPath</span>
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                    <Link to="#" className="text-gray-400 hover:text-white">About</Link>
                    <Link to="#" className="text-gray-400 hover:text-white">Features</Link>
                    <Link to="#" className="text-gray-400 hover:text-white">Contact</Link>
                </div>
            </div>
            <div className="mt-6 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
                © {new Date().getFullYear()} NovoPath Medical. All Rights Reserved.
            </div>
        </div>
    </footer>
);

const WelcomePage: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        const particleCount = 5000;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleColor = 0x3b82f6;
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: particleColor, transparent: true, opacity: 0.7 });
        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
        
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            particleSystem.rotation.y += 0.0005;
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            if(currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            <div ref={mountRef} id="bg-canvas" className="fixed top-0 left-0 w-full h-full z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,255,255,0.7))]"></div>
            
            <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
                <Header />
                <main className="flex-grow">
                    <HeroSection />
                    <StaggeredFeatureSection />
                    <TestimonialsSection />
                    <FinalCtaSection />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default WelcomePage;