import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { useApp } from '../../App';
import ToggleSwitch from '../../components/shared/ToggleSwitch';

const ProviderSettings: React.FC = () => {
    const { showToast } = useApp();
    const [isAvailable, setIsAvailable] = useState(true);

    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAvailable(e.target.checked);
    };

    const handleSaveChanges = () => {
        // Here you would typically make an API call to save the provider's status
        showToast(`Your status has been updated to: ${isAvailable ? 'Available' : 'Unavailable'}`, 'success');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            <div className="max-w-2xl">
                <Card title="Account Settings">
                    <div className="space-y-6">
                        {/* Availability Status Section */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-grow flex flex-col">
                                <span className="font-medium text-gray-900">Availability Status</span>
                                <span className="text-sm text-gray-500">
                                    Set whether you are available to receive new messages from patients.
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm font-semibold ${isAvailable ? 'text-emerald-600' : 'text-gray-500'}`}>
                                    {isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                                <ToggleSwitch 
                                    name="availability" 
                                    checked={isAvailable} 
                                    onChange={handleAvailabilityChange}
                                />
                            </div>
                        </div>
                        
                        {/* Other settings can be added here in the future */}

                        <div className="text-right border-t border-gray-200 pt-4">
                            <button 
                                onClick={handleSaveChanges} 
                                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProviderSettings;