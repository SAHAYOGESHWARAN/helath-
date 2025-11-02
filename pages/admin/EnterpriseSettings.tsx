import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import ToggleSwitch from '../../components/shared/ToggleSwitch';

const EnterpriseSettings: React.FC = () => {
    return (
        <div>
            <PageHeader title="Enterprise Settings" subtitle="Manage organization-level configurations." />
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
                            <input type="text" id="sso-entity-id" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="sso-acs-url" className="block text-sm font-medium text-gray-700">ACS URL (read-only)</label>
                            <input type="text" id="sso-acs-url" disabled value="https://api.novopath.com/sso/callback" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
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
                            <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">Primary Brand Color</label>
                            <input type="color" id="primary-color" defaultValue="#2563eb" className="mt-1 h-10 w-full block border border-gray-300 rounded-md" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EnterpriseSettings;