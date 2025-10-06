import React, { useState } from 'react';
import Card from '../../components/shared/Card';

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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFlagToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureFlags({ ...featureFlags, [e.target.name]: e.target.checked });
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">System Settings</h1>
      <div className="space-y-8">
        <Card title="API Integrations">
          <form className="space-y-4">
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
          </div>
        </Card>
        
        <Card title="Maintenance Mode" className="bg-red-50 border border-red-200">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-red-800">Enable Maintenance Mode</h3>
                    <p className="text-sm text-red-600">This will make the site temporarily unavailable to patients and providers.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Activate
                </button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;