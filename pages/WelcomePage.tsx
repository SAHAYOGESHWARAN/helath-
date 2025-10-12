import React from 'react';
import { Link } from 'react-router-dom';
import { NovoPathIcon, CalendarIcon, DocumentTextIcon, VideoCameraIcon, SparklesIcon, CheckCircleIcon } from '../components/shared/Icons';

const HeroAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-lg">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {/* Lines */}
      <path d="M50 50 L 150 150 L 250 50" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" className="hero-anim-line" style={{ animationDelay: '0s' }} />
      <path d="M50 350 L 150 250 L 50 150" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" className="hero-anim-line" style={{ animationDelay: '1s' }} />
      <path d="M350 50 L 250 150 L 350 250" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" className="hero-anim-line" style={{ animationDelay: '2s' }} />
      <path d="M150 150 L 250 250 L 150 350" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" className="hero-anim-line" style={{ animationDelay: '3s' }} />

      {/* Nodes */}
      <circle cx="50" cy="50" r="8" fill="#3b82f6" className="hero-anim-node" style={{ animationDelay: '0.2s' }} />
      <circle cx="250" cy="50" r="6" fill="#14b8a6" className="hero-anim-node" style={{ animationDelay: '0.4s' }} />
      <circle cx="350" cy="50" r="7" fill="#3b82f6" className="hero-anim-node" style={{ animationDelay: '0.6s' }} />
      <circle cx="50" cy="150" r="5" fill="#14b8a6" className="hero-anim-node" style={{ animationDelay: '0.8s' }} />
      <circle cx="150" cy="150" r="10" fill="#3b82f6" className="hero-anim-node" style={{ animationDelay: '1s' }} />
      <circle cx="250" cy="150" r="6" fill="#14b8a6" className="hero-anim-node" style={{ animationDelay: '1.2s' }} />
      <circle cx="150" cy="250" r="8" fill="#14b8a6" className="hero-anim-node" style={{ animationDelay: '1.4s' }} />
      <circle cx="250" cy="250" r="5" fill="#3b82f6" className="hero-anim-node" style={{ animationDelay: '1.6s' }} />
      <circle cx="350" cy="250" r="7" fill="#14b8a6" className="hero-anim-node" style={{ animationDelay: '1.8s' }} />
      <circle cx="50" cy="350" r="6" fill="#3b82f6" className="hero-anim-node" style={{ animationDelay: '2s' }} />
      <circle cx="150" cy="350" r="8" fill="#14b8a6" className="hero-anim-node" style={{ animationDelay: '2.2s' }} />
    </svg>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 scroll-animate" style={{ transitionDelay: `${delay * 100}ms` }}>
     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-accent-light text-primary-600 mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description: string; delay: number }> = ({ number, title, description, delay }) => (
    <div className="text-center scroll-animate bg-slate-50 px-4" style={{ transitionDelay: `${delay * 100}ms` }}>
        <div className="relative inline-block">
            <div className="w-20 h-20 flex items-center justify-center bg-white border-2 border-primary-200 rounded-full shadow-lg">
                <span className="text-3xl font-bold text-primary-500">{number}</span>
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
);


const TestimonialCard: React.FC<{ quote: string; name: string; role: string; avatar: string; delay: number }> = ({ quote, name, role, avatar, delay }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md scroll-animate" style={{ transitionDelay: `${delay * 100}ms` }}>
    <p className="text-gray-700 italic relative">
        <span className="absolute -top-2 -left-3 text-5xl text-primary-100 font-serif">“</span>
        {quote}
    </p>
    <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
      <div className="ml-4">
        <p className="font-bold text-gray-800">{name}</p>
        <p className="text-sm text-primary-700">{role}</p>
      </div>
    </div>
  </div>
);

const WelcomePage: React.FC = () => {
  return (
    <div className="bg-slate-50 text-gray-800 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/80">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <NovoPathIcon className="w-9 h-9" />
            <span className="text-2xl font-bold tracking-wider">NovoPath</span>
          </Link>
          <div className="space-x-2">
            <Link to="/login" className="px-5 py-2 text-sm font-medium text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm hover:shadow-md transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 animate-slide-in-up">
                  Intelligent Healthcare,
                  <br />
                  <span className="text-primary-600">Reimagined for You</span>
                </h1>
                <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-gray-600 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                  NovoPath is a comprehensive healthcare platform connecting patients and providers for seamless, intelligent, and personalized medical care.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                  <Link to="/register" className="px-8 py-3 font-semibold text-white bg-primary-600 rounded-lg shadow-md hover:bg-primary-700 transition-transform transform hover:scale-105">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="px-8 py-3 font-semibold text-primary-600 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                    I have an account
                  </Link>
                </div>
              </div>
              <div className="relative -mr-16 hidden lg:block animate-fade-in" style={{ animationDelay: '500ms' }}>
                <HeroAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold scroll-animate">A Better Path to Wellness</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto scroll-animate" style={{ transitionDelay: '100ms' }}>Explore the tools that empower your health journey.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<CalendarIcon className="w-7 h-7" />}
                title="Smart Scheduling"
                description="Effortlessly book, manage, and track your appointments online, anytime."
                delay={0}
              />
              <FeatureCard
                icon={<DocumentTextIcon className="w-7 h-7" />}
                title="Unified Health Records"
                description="Access your complete medical history, lab results, and medications in one secure place."
                delay={1}
              />
              <FeatureCard
                icon={<VideoCameraIcon className="w-7 h-7" />}
                title="Virtual Consultations"
                description="Connect with your provider from the comfort of your home with secure video calls."
                delay={2}
              />
              <FeatureCard
                icon={<SparklesIcon className="w-7 h-7" />}
                title="AI-Powered Assistance"
                description="Get answers to your health questions and insights from our intelligent assistant."
                delay={3}
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold scroll-animate">Getting Started is Easy</h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto scroll-animate" style={{ transitionDelay: '100ms' }}>
                        A simple, straightforward path to managing your health.
                    </p>
                </div>
                <div className="relative max-w-4xl mx-auto">
                    {/* Decorative connecting line */}
                    <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gray-200 -z-1"></div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <HowItWorksStep
                            number="01"
                            title="Create Your Account"
                            description="Sign up in minutes to create your secure, personal health hub."
                            delay={0}
                        />
                        <HowItWorksStep
                            number="02"
                            title="Connect with Your Provider"
                            description="Easily find your doctor or invite them to join the NovoPath network."
                            delay={1}
                        />
                        <HowItWorksStep
                            number="03"
                            title="Manage Your Health"
                            description="Book appointments, message your provider, and access your records, all in one place."
                            delay={2}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Tailored For Everyone Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold scroll-animate">Tailored For Everyone</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto scroll-animate" style={{ transitionDelay: '100ms' }}>
                Whether you're a patient seeking better access to care or a provider aiming to streamline your practice, NovoPath has you covered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* For Patients Card */}
              <div className="bg-gradient-to-br from-blue-50 to-primary-100 p-8 rounded-2xl border border-primary-200 shadow-lg scroll-animate" style={{ transitionDelay: '200ms' }}>
                <h3 className="text-2xl font-bold text-primary-800 mb-6">For Patients</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">24/7 Access:</span> Your complete health history, lab results, and medications at your fingertips.</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">Direct Communication:</span> Securely message your providers anytime, anywhere.</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">Seamless Experience:</span> Easily schedule appointments, join video calls, and handle payments.</p>
                  </li>
                </ul>
              </div>

              {/* For Providers Card */}
              <div className="bg-gradient-to-br from-teal-50 to-accent-light/50 p-8 rounded-2xl border border-accent/30 shadow-lg scroll-animate" style={{ transitionDelay: '300ms' }}>
                <h3 className="text-2xl font-bold text-accent-dark mb-6">For Providers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">Efficient Workflow:</span> Manage patients, appointments, and progress notes from a unified dashboard.</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">Integrated Tools:</span> Utilize built-in telehealth, e-prescribing, and billing to save time.</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">Grow Your Practice:</span> Access advanced analytics to understand your patient population and improve care.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold scroll-animate">Trusted by Patients and Providers</h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto scroll-animate" style={{ transitionDelay: '100ms' }}>See what our users are saying about NovoPath.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <TestimonialCard 
                        quote="NovoPath has revolutionized how I manage my health. Everything is in one place, from my appointments to my lab results. It's so empowering!"
                        name="John Doe"
                        role="Patient"
                        avatar="https://picsum.photos/seed/patient1/100"
                        delay={0}
                    />
                     <TestimonialCard 
                        quote="As a provider, this platform has saved me hours of administrative work. The patient management and e-prescribing tools are fantastic and let me focus more on care."
                        name="Dr. Jane Smith"
                        role="Cardiologist"
                        avatar="https://picsum.photos/seed/provider1/100"
                        delay={1}
                    />
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-br from-primary-600 to-accent text-white">
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-80 h-80 bg-white/10 rounded-full"></div>
            <div className="container mx-auto px-6 text-center relative scroll-animate">
                 <h2 className="text-3xl lg:text-4xl font-bold">Ready to Take Control of Your Health?</h2>
                 <p className="mt-4 max-w-2xl mx-auto">
                    Join thousands of others on a smarter path to healthcare. Creating an account is free and takes just a minute.
                </p>
                <div className="mt-8">
                     <Link to="/register" className="px-8 py-3 font-semibold text-primary-600 bg-white rounded-lg shadow-lg hover:bg-primary-50 transition-transform transform hover:scale-105">
                        Create Your Free Account
                    </Link>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400">
        <div className="container mx-auto px-6 py-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} NovoPath Medical. All rights reserved.</p>
            <div className="mt-4 space-x-4">
                <Link to="#" className="hover:text-white">Privacy Policy</Link>
                <Link to="#" className="hover:text-white">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;