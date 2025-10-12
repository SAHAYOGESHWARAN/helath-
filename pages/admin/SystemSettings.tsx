import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { SpinnerIcon } from '../../components/shared/Icons';

const SystemSettings: React.FC = () => {
    const { showToast } = useApp();
    const { systemSettings, updateSystemSettings } = useAuth();
    const [settings, setSettings] = useState(systemSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(s => ({ ...s, [e.target.name]: e.target.checked }));
    };

    const handleSave = () => {
        setIsSubmitting(true);
        updateSystemSettings(settings).then(() => {
            showToast('System settings have been updated!', 'success');
            setIsSubmitting(false);
        });
    };

    return (
        <div>
            <PageHeader title="System Settings" subtitle="Manage global platform configurations and status." />
            <div className="max-w-2xl mx-auto space-y-8">
                <Card title="Feature Flags">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                            <p className="font-medium text-gray-700">Allow new patient registrations</p>
                            <ToggleSwitch name="newPatientRegistrations" checked={settings.newPatientRegistrations} onChange={handleChange} />
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                            <p className="font-medium text-gray-700">Allow new provider applications</p>
                            <ToggleSwitch name="newProviderRegistrations" checked={settings.newProviderRegistrations} onChange={handleChange} />
                        </div>
                    </div>
                </Card>

                <Card title="Platform Status">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-md bg-red-50 border border-red-200">
                            <div>
                                <p className="font-medium text-red-800">Enable Maintenance Mode</p>
                                <p className="text-sm text-red-600">This will make the platform temporarily unavailable to all users.</p>
                            </div>
                            <ToggleSwitch name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
                        </div>
                    </div>
                </Card>
                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg w-48 flex items-center justify-center">
                        {isSubmitting ? <SpinnerIcon/> : 'Save System Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
