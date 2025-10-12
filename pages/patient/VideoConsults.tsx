import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { VideoCameraIcon, CheckCircleIcon, XCircleIcon } from '../../components/shared/Icons';
import { SpeakerWaveIcon, MicrophoneIcon } from '../../components/shared/Icons';

const upcomingConsult = {
    providerName: 'Dr. David Chen',
    reason: 'Dermatology Follow-up',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: '02:00 PM',
};

const VideoConsults: React.FC = () => {
    const [cameraStatus, setCameraStatus] = useState<'checking' | 'ok' | 'error'>('checking');
    const [micStatus, setMicStatus] = useState<'checking' | 'ok' | 'error'>('checking');
    const [speakerStatus, setSpeakerStatus] = useState<'checking' | 'ok' | 'error'>('ok'); // Hard to test speakers programmatically
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        let isMounted = true;
        
        const checkPermissions = async () => {
            // Check Camera
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (isMounted) {
                    setCameraStatus('ok');
                    setStream(videoStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = videoStream;
                    }
                }
            } catch (err) {
                if (isMounted) setCameraStatus('error');
                console.error("Camera access denied:", err);
            }

            // Check Microphone
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (isMounted) {
                    setMicStatus('ok');
                    // We need to stop this stream as we don't need it active
                    audioStream.getTracks().forEach(track => track.stop());
                }
            } catch (err) {
                if (isMounted) setMicStatus('error');
                console.error("Microphone access denied:", err);
            }
        };

        checkPermissions();

        return () => {
            isMounted = false;
            stopStream();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const StatusIndicator: React.FC<{ status: 'checking' | 'ok' | 'error' }> = ({ status }) => {
        if (status === 'ok') return <CheckCircleIcon className="w-6 h-6 text-emerald-500" />;
        if (status === 'error') return <XCircleIcon className="w-6 h-6 text-red-500" />;
        return <div className="w-5 h-5 border-2 border-dashed rounded-full border-gray-400 animate-spin"></div>;
    };

    return (
        <div>
            <PageHeader title="Video Consultations" subtitle="Connect with your provider from anywhere." />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Upcoming Virtual Visit">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{upcomingConsult.providerName}</p>
                            <p className="text-gray-600 mb-2">{upcomingConsult.reason}</p>
                            <p className="font-semibold text-primary-700">
                                {upcomingConsult.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {upcomingConsult.time}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex items-center space-x-2">
                                <VideoCameraIcon className="w-5 h-5" />
                                <span>Join Now</span>
                            </button>
                        </div>
                    </div>
                </Card>

                <Card title="System Check">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <VideoCameraIcon className="w-6 h-6 text-gray-500 mr-3"/>
                                <span className="font-medium text-gray-700">Camera</span>
                            </div>
                            <StatusIndicator status={cameraStatus} />
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MicrophoneIcon className="w-6 h-6 text-gray-500 mr-3"/>
                                <span className="font-medium text-gray-700">Microphone</span>
                            </div>
                            <StatusIndicator status={micStatus} />
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <SpeakerWaveIcon className="w-6 h-6 text-gray-500 mr-3"/>
                                <span className="font-medium text-gray-700">Speakers</span>
                            </div>
                            <StatusIndicator status={speakerStatus} />
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
