import React from 'react';
import Card from '../../components/shared/Card';

const EnterpriseSettings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Enterprise Settings</h1>
      <div className="space-y-8">
        <Card title="Single Sign-On (SSO)">
          <form className="space-y-4">
            <div>
              <label htmlFor="sso-provider" className="block text-sm font-medium text-gray-700">Identity Provider</label>
              <select id="sso-provider" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option>Okta</option>
                <option>Azure AD</option>
                <option>Google Workspace</option>
              </select>
            </div>
            <div>
              <label htmlFor="sso-entity-id" className="block text-sm font-medium text-gray-700">Entity ID</label>
              <input type="text" id="sso-entity-id" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="sso-acs-url" className="block text-sm font-medium text-gray-700">ACS URL</label>
              <input type="text" id="sso-acs-url" disabled value="https://api.tangerinehealth.com/sso/callback" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"/>
            </div>
            <div className="text-right pt-2">
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save SSO Config</button>
            </div>
          </form>
        </Card>

        <Card title="White-Labeling">
           <div className="space-y-4">
            <div>
              <label htmlFor="custom-logo" className="block text-sm font-medium text-gray-700">Custom Logo</label>
              <input type="file" id="custom-logo" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
            </div>
             <div>
              <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">Primary Color</label>
              <input type="color" id="primary-color" defaultValue="#3b82f6" className="mt-1 h-10 w-full block border border-gray-300 rounded-md"/>
            </div>
           </div>
        </Card>

        <Card title="Advanced Security">
           <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Enforce Multi-Factor Authentication (MFA)</span>
               <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Strict Password Policy</span>
               <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked readOnly className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseSettings;