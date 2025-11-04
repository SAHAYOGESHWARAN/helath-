
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
// FIX: Replaced MailIcon with EnvelopeIcon and aliased it as MailIcon
import { AcademicCapIcon, BriefcaseIcon, EnvelopeIcon as MailIcon, PhoneIcon } from '../../components/shared/Icons';

const ProviderProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Provider Profile" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="text-center p-8">
            <img src={user.avatarUrl} alt="Provider Avatar" className="w-32 h-32 rounded-full mx-auto border-4 border-primary-200 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-primary-600 font-semibold">{user.specialty}</p>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card title="Professional Information">
            <div className="space-y-4">
              <div className="flex items-center">
                <AcademicCapIcon className="w-6 h-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Specialty</p>
                  <p className="font-semibold text-gray-800">{user.specialty}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="w-6 h-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Medical License</p>
                  <p className="font-semibold text-gray-800">{user.licenseNumber} ({user.state})</p>
                </div>
              </div>
              <div className="flex items-center">
                <MailIcon className="w-6 h-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-6 h-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;