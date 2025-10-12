
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { VideoCameraIcon, MailIcon, DeviceMobileIcon, CalendarIcon, HomeIcon, ProfileIcon as UserIcon } from '../../components/shared/Icons';

// Modal Component for updating profile picture
const ProfilePictureModal: React.FC<{
  onClose: () => void;
  onSave: (imageDataUrl: string) => void;
}> = ({ onClose, onSave }) => {
  const [view, setView] = useState<'options' | 'camera' | 'preview'>('options');
  const [imageData, setImageData] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    stopCamera();
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setView('camera');
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access was denied. Please enable camera permissions in your browser settings.");
      setView('options');
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageData(dataUrl);
      stopCamera();
      setView('preview');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
        setView('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setImageData(null);
    setError(null);
    stopCamera();
    setView('options');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const renderContent = () => {
    switch (view) {
      case 'camera':
        return (
          <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-gray-900 rounded-md mb-4 object-cover"></video>
            <div className="flex w-full justify-between">
              <button onClick={() => setView('options')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Back</button>
              <button onClick={takePicture} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Take Picture</button>
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className="flex flex-col items-center">
            {imageData && <img src={imageData} alt="Preview" className="w-full h-64 object-contain rounded-md mb-4" />}
            <div className="flex w-full justify-between">
              <button onClick={reset} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Try Again</button>
              <button onClick={() => imageData && onSave(imageData)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">Use this Picture</button>
            </div>
          </div>
        );
      case 'options':
      default:
        return (
          <div className="text-center">
            {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>}
            <div className="space-y-4">
              <button onClick={handleChooseFile} className="w-full text-white bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-lg px-5 py-3.5 text-center">
                Upload a Photo
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button onClick={startCamera} className="w-full text-white bg-emerald-500 hover:bg-emerald-600 font-medium rounded-lg text-lg px-5 py-3.5 text-center">
                Use Camera
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative animate-slide-in-up">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Update Profile Picture</h3>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {renderContent()}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};


const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    address: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetFormData = useCallback(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        dob: user.dob || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    resetFormData();
  }, [resetFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileData);
    showToast('Profile updated successfully!', 'success');
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    resetFormData();
    setIsEditing(false);
  };

  const handleSavePicture = (imageDataUrl: string) => {
    if (user) {
      updateUser({ avatarUrl: imageDataUrl });
      showToast('Profile picture updated!', 'success');
      setIsModalOpen(false);
    }
  };

  if (!user) {
    return null;
  }
  
  const InfoField: React.FC<{ icon: React.ReactNode; label: string; value?: string; }> = ({ icon, label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <div className="mt-1 flex items-center space-x-3">
            {icon}
            <p className="text-gray-800">{value || 'Not set'}</p>
        </div>
    </div>
  );

  const EditField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, onChange, type = 'text' }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
     </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="text-center">
            <div className="relative group w-32 h-32 mx-auto mb-4">
              <img 
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-32 h-32 rounded-full mx-auto border-4 border-primary-200"
              />
              <button 
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                aria-label="Update profile picture"
              >
                <VideoCameraIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card title="Personal Information">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <EditField label="Full Name" name="name" value={profileData.name} onChange={handleInputChange} />
                <EditField label="Email Address" name="email" value={profileData.email} onChange={handleInputChange} type="email" />
                <EditField label="Date of Birth" name="dob" value={profileData.dob} onChange={handleInputChange} type="date" />
                <EditField label="Phone Number" name="phone" value={profileData.phone} onChange={handleInputChange} type="tel" />
                <EditField label="Address" name="address" value={profileData.address} onChange={handleInputChange} />
                <div className="text-right flex justify-end space-x-3">
                  <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                  <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <InfoField icon={<UserIcon className="w-5 h-5 text-gray-400" />} label="Full Name" value={profileData.name} />
                <InfoField icon={<MailIcon className="w-5 h-5 text-gray-400" />} label="Email Address" value={profileData.email} />
                <InfoField icon={<CalendarIcon className="w-5 h-5 text-gray-400" />} label="Date of Birth" value={profileData.dob} />
                <InfoField icon={<DeviceMobileIcon className="w-5 h-5 text-gray-400" />} label="Phone Number" value={profileData.phone} />
                <InfoField icon={<HomeIcon className="w-5 h-5 text-gray-400" />} label="Address" value={profileData.address} />
                
                <div className="text-right border-t pt-6 mt-6">
                  <button onClick={() => setIsEditing(true)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      {isModalOpen && <ProfilePictureModal onClose={() => setIsModalOpen(false)} onSave={handleSavePicture} />}
    </div>
  );
};

export default Profile;
