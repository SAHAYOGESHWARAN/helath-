import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { MailIcon, DeviceMobileIcon, BriefcaseIcon, ProfileIcon as UserIcon } from '../../components/shared/Icons';

const ProviderProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
  });

  const resetFormData = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '555-987-6543',
        specialty: user.specialty || 'Cardiology',
      });
    }
  };

  useEffect(() => {
    resetFormData();
  }, [user]);

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

  if (!user) {
    return null;
  }

  const InfoField: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <div className="mt-1 flex items-center space-x-3">
            {icon}
            <p className="text-gray-800">{value}</p>
        </div>
    </div>
  );

  const EditField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, onChange }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={name === 'email' ? 'email' : 'text'}
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
            <img 
              src={user.avatarUrl}
              alt="Provider Avatar"
              className="w-32 h-32 rounded-full mx-auto border-4 border-primary-200"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
            <p className="text-gray-500">{user.specialty}</p>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card title="Professional Information">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <EditField label="Full Name" name="name" value={profileData.name} onChange={handleInputChange} />
                <EditField label="Email Address" name="email" value={profileData.email} onChange={handleInputChange} />
                <EditField label="Specialty" name="specialty" value={profileData.specialty} onChange={handleInputChange} />
                <EditField label="Phone Number" name="phone" value={profileData.phone} onChange={handleInputChange} />
                
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
                <InfoField icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} label="Specialty" value={profileData.specialty} />
                <InfoField icon={<DeviceMobileIcon className="w-5 h-5 text-gray-400" />} label="Phone Number" value={profileData.phone} />
                
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
    </div>
  );
};

export default ProviderProfile;