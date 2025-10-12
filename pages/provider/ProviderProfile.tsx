
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useApp } from '../../App';
import { CameraIcon, MailIcon, DeviceMobileIcon } from '../../components/shared/Icons';

const ProviderProfile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        specialty: user?.specialty || '',
        licenseNumber: user?.licenseNumber || '',
    });

    if (!user) {
        return <div>Loading profile...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateUser(formData);
        showToast('Profile updated successfully!', 'success');
        setEditMode(false);
    };
    
    const handleCancel = () => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            specialty: user.specialty || '',
            licenseNumber: user.licenseNumber || '',
        });
        setEditMode(false);
    };

    return (
        <div>
            <PageHeader title="Provider Profile" subtitle="Manage your public and private information." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <img src={user.avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-primary-200" />
                                <button className="absolute bottom-1 right-1 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full">
                                    <CameraIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-primary-700 font-semibold">{user.specialty}</p>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card title="Professional Information">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                {editMode ? <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /> : <p className="text-lg text-gray-800">{formData.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                                <p className="text-lg text-gray-800 flex items-center"><MailIcon className="w-5 h-5 mr-2 text-gray-400"/>{formData.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                                {editMode ? <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /> : <p className="text-lg text-gray-800 flex items-center"><DeviceMobileIcon className="w-5 h-5 mr-2 text-gray-400"/>{formData.phone || 'Not provided'}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Specialty</label>
                                {editMode ? <input type="text" name="specialty" value={formData.specialty} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /> : <p className="text-lg text-gray-800">{formData.specialty}</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-500">License Number</label>
                                <p className="text-lg text-gray-800 font-mono">{formData.licenseNumber}</p>
                            </div>
                        </div>
                         <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            {editMode ? (
                                <>
                                    <button onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                    <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                                </>
                            ) : (
                                <button onClick={() => setEditMode(true)} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
