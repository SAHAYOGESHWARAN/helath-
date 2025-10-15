import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { NovoPathLogoIcon } from '../components/shared/Icons';

const WelcomePage: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        // Create particles
        const particleCount = 5000;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.7,
        });
        
        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
        
        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Particle rotation
            particleSystem.rotation.y += 0.0005;
            particleSystem.rotation.x += 0.0002;
            
            // Camera movement based on mouse
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const onResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            if(currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans overflow-hidden relative">
            <div ref={mountRef} id="bg-canvas" className="absolute top-0 left-0 w-full h-full z-0" />
            
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <NovoPathLogoIcon className="w-8 h-8" />
                            <span className="text-2xl font-bold text-gray-800">NovoPath</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-md font-medium text-gray-700 hover:text-primary-600 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="text-md font-medium text-white bg-primary-600 px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>
                
                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center text-center">
                    <div className="container mx-auto px-6">
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight animate-text-focus-in">
                            Pioneering the Future of <br/> Personalized Health
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
                            An intelligent, connected platform that empowers both patients and providers with seamless tools for a healthier tomorrow.
                        </p>
                        <div className="mt-10 flex items-center justify-center space-x-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
                            <Link to="/register" className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-transform transform hover:scale-105 shadow-lg">
                                Explore the Platform
                            </Link>
                            <Link to="/login" className="border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                                I have an account
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WelcomePage;