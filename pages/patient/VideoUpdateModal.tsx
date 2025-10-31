import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from '../../components/shared/Modal';
import { CameraIcon, StopIcon, ArrowPathIcon, PaperAirplaneIcon } from '../../components/shared/Icons';

interface VideoUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (videoBlobUrl: string) => void;
}

const VideoUpdateModal: React.FC<VideoUpdateModalProps> = ({ isOpen, onClose, onSend }) => {
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);

  const MAX_RECORDING_TIME = 30; // 30 seconds

  const cleanup = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    recordedChunksRef.current = [];
    setVideoBlobUrl(null);
    setError(null);
    setRecordingStatus('idle');
    setCountdown(0);
  }, []);

  const setupMedia = useCallback(async () => {
    cleanup();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
      setError(null);
    } catch (err) {
      console.error('Media access denied:', err);
      setError('Camera and microphone access is required. Please enable permissions in your browser settings.');
    }
  }, [cleanup]);
  
  useEffect(() => {
    if (isOpen && recordingStatus === 'idle') {
      setupMedia();
    }
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen, recordingStatus, setupMedia, cleanup]);
  
  const handleStartRecording = () => {
    if (!mediaStreamRef.current) return;
    
    setRecordingStatus('recording');
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoBlobUrl(url);
      setRecordingStatus('preview');
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };

    recorder.start();
    setCountdown(MAX_RECORDING_TIME);

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleStopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(0);
  };
  
  const handleRetake = () => {
    cleanup();
    setupMedia();
  };

  const handleSend = () => {
    if (videoBlobUrl) {
      onSend(videoBlobUrl);
    }
  };

  const renderContent = () => {
    if (error) {
      return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;
    }

    switch (recordingStatus) {
      case 'recording':
        return (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-72 object-cover rounded-md bg-black" />
            <div className="absolute top-2 right-2 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              REC {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
            </div>
             <div className="mt-4 flex justify-center">
              <button onClick={handleStopRecording} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <StopIcon className="w-5 h-5" /> Stop Recording
              </button>
            </div>
          </div>
        );
      case 'preview':
        return (
          <div>
            <video src={videoBlobUrl!} controls autoPlay className="w-full h-72 object-cover rounded-md bg-black" />
            <div className="mt-4 flex justify-between">
              <button onClick={handleRetake} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <ArrowPathIcon className="w-5 h-5" /> Retake
              </button>
              <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <PaperAirplaneIcon className="w-5 h-5" /> Send Update
              </button>
            </div>
          </div>
        );
      case 'idle':
      default:
        return (
          <div>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-72 object-cover rounded-md bg-black" />
            <div className="mt-4 flex justify-center">
              <button onClick={handleStartRecording} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                <CameraIcon className="w-5 h-5" /> Start Recording
              </button>
            </div>
             <p className="text-xs text-center text-gray-500 mt-2">Max recording time: {MAX_RECORDING_TIME} seconds</p>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record a Video Update">
      {renderContent()}
    </Modal>
  );
};

export default VideoUpdateModal;