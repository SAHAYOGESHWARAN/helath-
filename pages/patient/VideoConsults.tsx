import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { VideoCameraIcon, CheckCircleIcon, XCircleIcon, ShieldCheckIcon, PhoneIcon } from '../../components/shared/Icons';
import { SpeakerWaveIcon, MicrophoneIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const VideoConsults: React.FC = () => {
    const { user } = useAuth();
    const [cameraStatus, setCameraStatus] = useState<'checking' | 'ok' | 'error'>('checking');
    const [micStatus, setMicStatus] = useState<'checking' | 'ok' | 'error'>('checking');
    const [inCall, setInCall] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);

    const isSubscribed = user?.subscription?.status === 'Active';

    const setupMedia = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setCameraStatus('ok');
            setMicStatus('ok');
            setStream(mediaStream);
        } catch (err) {
            setCameraStatus('error');
            setMicStatus('error');
            console.error("Media access denied:", err);
        }
    };
    
    useEffect(() => {
        if (inCall && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        return () => {
            if (!inCall) {
                stream?.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        };
    }, [inCall, stream]);
    
    useEffect(() => {
        setupMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleJoinCall = () => {
        if (cameraStatus === 'ok' && micStatus === 'ok') {
            setInCall(true);
        } else {
            alert('Please fix camera and microphone issues before joining.');
        }
    };

    const handleEndCall = () => {
        setInCall(false);
        setIsCamOff(false);
        setIsMicMuted(false);
        // Re-run setup to get permissions and preview for next time
        setupMedia();
    };

    const toggleMic = () => {
        stream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMicMuted(prev => !prev);
    };

    const toggleCam = () => {
        stream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsCamOff(prev => !prev);
    };

    if (inCall) {
        return (
            <div className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-10rem)] flex flex-col relative text-white animate-fade-in">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Remote Video (Placeholder) */}
                    <div className="bg-black rounded-md flex items-center justify-center">
                        <p className="text-gray-400">Waiting for provider...</p>
                    </div>
                    {/* Local Video */}
                    <div className="bg-black rounded-md flex items-center justify-center relative md:absolute md:bottom-4 md:right-4 md:w-1/4 md:h-1/4">
                        <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover rounded-md ${isCamOff ? 'hidden' : ''}`} />
                        {isCamOff && <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold">{user?.name[0]}</div>}
                    </div>
                </div>
                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 p-3 bg-gray-800/70 rounded-full backdrop-blur-sm">
                    <button onClick={toggleMic} className={`p-3 rounded-full ${isMicMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}><MicrophoneIcon className="w-6 h-6"/></button>
                    <button onClick={toggleCam} className={`p-3 rounded-full ${isCamOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}><VideoCameraIcon className="w-6 h-6"/></button>
                    <button onClick={handleEndCall} className="p-3 rounded-full bg-red-600 hover:bg-red-700"><PhoneIcon className="w-6 h-6 rotate-[135deg]"/></button>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <PageHeader title="Video Consultations" subtitle="Connect with your provider from anywhere." />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Consultation Room">
                    <div className="space-y-4">
                        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                            <h3 className="text-xl font-bold text-primary-700">Your virtual visit is ready.</h3>
                            <p className="text-gray-600 mt-1">When it's time for your appointment, click the button below to join the secure session.</p>
                        </div>
                        
                        <div>
                             <p className="font-semibold text-gray-700 mb-2">Status</p>
                             <div className={`p-3 rounded-lg flex items-center ${isSubscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                <ShieldCheckIcon className="w-5 h-5 mr-3"/>
                                <span className="text-sm font-medium">{isSubscribed ? 'Subscription Active: You can join consultations.' : 'Subscription Required to Join Calls'}</span>
                             </div>
                        </div>

                        <div className="pt-4 border-t">
                            <button 
                                disabled={!isSubscribed || cameraStatus !== 'ok' || micStatus !== 'ok'}
                                onClick={handleJoinCall}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                            >
                                <VideoCameraIcon className="w-5 h-5" />
                                <span>Join Consultation</span>
                            </button>
                             {!isSubscribed && (
                                <p className="text-center text-sm text-gray-600 mt-3">
                                    Please <Link to="/subscription" className="font-semibold text-primary-600 hover:underline">subscribe to a plan</Link> to enable video consultations.
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                <Card title="System Check">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center"><VideoCameraIcon className="w-6 h-6 text-gray-500 mr-3"/><span className="font-medium text-gray-700">Camera</span></div>
                            {cameraStatus === 'ok' ? <CheckCircleIcon className="w-6 h-6 text-emerald-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
                        </div>
                         <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center"><MicrophoneIcon className="w-6 h-6 text-gray-500 mr-3"/><span className="font-medium text-gray-700">Microphone</span></div>
                            {micStatus === 'ok' ? <CheckCircleIcon className="w-6 h-6 text-emerald-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
                        </div>
                         <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center"><SpeakerWaveIcon className="w-6 h-6 text-gray-500 mr-3"/><span className="font-medium text-gray-700">Speakers</span></div>
                            <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                    <div className="mt-4 p-2 border rounded-md bg-gray-100 h-32">
                        {cameraStatus === 'ok' ? (
                             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                {cameraStatus === 'checking' ? 'Checking camera...' : 'Camera preview unavailable'}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
             <Card title="Tips for a Successful Consultation" className="mt-8">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Find a quiet, well-lit space to avoid distractions.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Write down any questions or concerns you want to discuss beforehand.</li>
                    <li>Close other applications on your device that might use your camera or microphone.</li>
                </ul>
            </Card>
        </div>
    );
};

export default VideoConsults;