import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import PageHeader from '../../components/shared/PageHeader';

const EnterpriseSettings: React.FC = () => {
  const { enterpriseSettings, updateEnterpriseSettings } = useAuth();
  const { showToast } = useApp();

  // State for each section to handle granular saving and loading
  const [ssoConfig, setSsoConfig] = useState({ provider: enterpriseSettings.ssoProvider, entityId: enterpriseSettings.ssoEntityId });
  const [brandingConfig, setBrandingConfig] = useState({ primaryColor: enterpriseSettings.primaryColor, logo: enterpriseSettings.customLogoUrl || null });
  const [securityConfig, setSecurityConfig] = useState({ enforceMfa: enterpriseSettings.enforceMfa });
  
  const [isSsoSaving, setIsSsoSaving] = useState(false);
  const [isBrandingSaving, setIsBrandingSaving] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

  const handleSsoSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSsoSaving(true);
    updateEnterpriseSettings({ ...enterpriseSettings, ...ssoConfig }).then(() => {
        setIsSsoSaving(false);
        showToast('SSO settings saved successfully!', 'success');
    });
  };

  const handleBrandingSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBrandingSaving(true);
    updateEnterpriseSettings({ ...enterpriseSettings, primaryColor: brandingConfig.primaryColor, customLogoUrl: brandingConfig.logo || undefined }).then(() => {
        setIsBrandingSaving(false);
        showToast('Branding settings saved successfully!', 'success');
    });
  };
  
  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSecuritySaving(true);
    updateEnterpriseSettings({ ...enterpriseSettings, enforceMfa: securityConfig.enforceMfa }).then(() => {
        setIsSecuritySaving(false);
        showToast('Security settings saved successfully!', 'success');
    });
  };
  
  return (
    <div>
      <PageHeader title="Enterprise Settings" subtitle="Configure SSO, branding, and advanced security for your organization." />
      <div className="space-y-8 max-w-3xl mx-auto">
        <Card title="Single Sign-On (SSO)">
          <form className="space-y-4" onSubmit={handleSsoSave}>
            <div>
              <label htmlFor="sso-provider" className="block text-sm font-medium text-gray-700">Identity Provider</label>
              <select 
                id="sso-provider" 
                value={ssoConfig.provider}
                onChange={e => setSsoConfig({...ssoConfig, provider: e.target.value as any})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                <option>Okta</option>
                <option>Azure AD</option>
                <option>Google Workspace</option>
              </select>
            </div>
            <div>
              <label htmlFor="sso-entity-id" className="block text-sm font-medium text-gray-700">Entity ID</label>
              <input 
                type="text" 
                id="sso-entity-id" 
                value={ssoConfig.entityId}
                onChange={e => setSsoConfig({...ssoConfig, entityId: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="sso-acs-url" className="block text-sm font-medium text-gray-700">ACS URL (read-only)</label>
              <input type="text" id="sso-acs-url" disabled value="https://api.novopath.com/sso/callback" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"/>
            </div>
            <div className="text-right pt-2 border-t">
              <button type="submit" disabled={isSsoSaving} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-40 flex justify-center items-center">
                {isSsoSaving ? <SpinnerIcon /> : 'Save SSO Config'}
              </button>
            </div>
          </form>
        </Card>

        <Card title="White-Labeling">
           <form className="space-y-4" onSubmit={handleBrandingSave}>
            <div>
              <label htmlFor="custom-logo" className="block text-sm font-medium text-gray-700">Custom Logo</label>
              <input type="file" id="custom-logo" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
            </div>
             <div>
              <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">Primary Color</label>
              <input 
                type="color" 
                id="primary-color" 
                value={brandingConfig.primaryColor}
                onChange={e => setBrandingConfig({...brandingConfig, primaryColor: e.target.value})}
                className="mt-1 h-10 w-full block border border-gray-300 rounded-md"
              />
            </div>
             <div className="text-right pt-2 border-t">
              <button type="submit" disabled={isBrandingSaving} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-44 flex justify-center items-center">
                {isBrandingSaving ? <SpinnerIcon /> : 'Save Branding'}
              </button>
            </div>
           </form>
        </Card>

        <Card title="Advanced Security">
           <form className="space-y-4" onSubmit={handleSecuritySave}>
            <div className="flex items-center justify-between p-3 rounded-md bg-white border">
              <p className="text-sm font-medium text-gray-900">Enforce Multi-Factor Authentication (MFA)</p>
               <ToggleSwitch 
                name="enforceMfa"
                checked={securityConfig.enforceMfa}
                onChange={e => setSecurityConfig({ enforceMfa: e.target.checked })}
               />
            </div>
             <div className="flex items-center justify-between p-3 rounded-md bg-white border">
              <p className="text-sm font-medium text-gray-900">Strict Password Policy</p>
               <ToggleSwitch 
                name="strictPolicy"
                checked={true}
                onChange={() => {}} // This is a read-only, always-on setting for the demo
               />
            </div>
             <div className="text-right pt-2 border-t">
              <button type="submit" disabled={isSecuritySaving} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-44 flex justify-center items-center">
                {isSecuritySaving ? <SpinnerIcon /> : 'Save Security'}
              </button>
            </div>
           </form>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseSettings;