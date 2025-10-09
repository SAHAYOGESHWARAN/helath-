
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { useApp } from '../../App';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    squareAppId: 'sq0idp-EXAMPLE',
    twilioSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    sentryDsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  });

  const [featureFlags, setFeatureFlags] = useState({
    aiAssistant: true,
    videoConsults: true,
    patientSubscriptions: false,
  });

  const { showToast } = useApp();

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFlagToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureFlags({ ...featureFlags, [e.target.name]: e.target.checked });
  };

  const handleSave = (section: string) => {
    showToast(`${section} settings saved successfully!`, 'success');
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">System Settings</h1>
      <div className="space-y-8">
        <Card title="API Integrations">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave('API'); }}>
            <div>
              <label htmlFor="squareAppId" className="block text-sm font-medium text-gray-700">Square App ID</label>
              <input type="text" name="squareAppId" id="squareAppId" value={settings.squareAppId} onChange={handleSettingsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
             <div>
              <label htmlFor="twilioSid" className="block text-sm font-medium text-gray-700">Twilio Account SID</label>
              <input type="text" name="twilioSid" id="twilioSid" value={settings.twilioSid} onChange={handleSettingsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
             <div>
              <label htmlFor="sentryDsn" className="block text-sm font-medium text-gray-700">Sentry DSN</label>
              <input type="text" name="sentryDsn" id="sentryDsn" value={settings.sentryDsn} onChange={handleSettingsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
             <div className="text-right pt-2">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save API Keys</button>
            </div>
          </form>
        </Card>

        <Card title="Feature Flags">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Enable AI Health Assistant</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="aiAssistant" checked={featureFlags.aiAssistant} onChange={handleFlagToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Enable Video Consultations</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="videoConsults" checked={featureFlags.videoConsults} onChange={handleFlagToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Enable Patient Subscriptions</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="patientSubscriptions" checked={featureFlags.patientSubscriptions} onChange={handleFlagToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
             <div className="text-right pt-2">
                <button onClick={() => handleSave('Feature Flag')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Flags</button>
            </div>
          </div>
        </Card>
        
        <Card title="Notification Templates">
            <div className="space-y-4">
                <div>
                    <label htmlFor="appointmentReminder" className="block text-sm font-medium text-gray-700">Appointment Reminder SMS</label>
                    <textarea id="appointmentReminder" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" defaultValue="Hi {patientName}, this is a reminder for your appointment with {providerName} on {date} at {time}."/>
                </div>
                 <div>
                    <label htmlFor="labResultEmail" className="block text-sm font-medium text-gray-700">Lab Result Email Subject</label>
                    <input type="text" id="labResultEmail" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" defaultValue="Your new lab results are available"/>
                </div>
                 <div className="text-right pt-2">
                    <button onClick={() => handleSave('Template')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Templates</button>
                </div>
            </div>
        </Card>

        <Card title="Maintenance Mode" className="bg-red-50 border border-red-200">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-red-800">Enable Maintenance Mode</h3>
                    <p className="text-sm text-red-600">This will make the site temporarily unavailable to patients and providers.</p>
                </div>
                <button onClick={() => showToast('Maintenance mode activated!', 'error')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Activate
                </button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;