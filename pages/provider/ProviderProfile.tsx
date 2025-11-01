"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
// FIX: Replaced MailIcon with EnvelopeIcon and aliased it as MailIcon
var Icons_1 = require("../../components/shared/Icons");
var ProviderProfile = function () {
    var user = (0, useAuth_1.useAuth)().user;
    if (!user)
        return null;
    return (<div>
      <PageHeader_1.default title="Provider Profile"/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card_1.default className="text-center p-8">
            <img src={user.avatarUrl} alt="Provider Avatar" className="w-32 h-32 rounded-full mx-auto border-4 border-primary-200 mb-4"/>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-primary-600 font-semibold">{user.specialty}</p>
          </Card_1.default>
        </div>
        <div className="md:col-span-2">
          <Card_1.default title="Professional Information">
            <div className="space-y-4">
              <div className="flex items-center">
                <Icons_1.AcademicCapIcon className="w-6 h-6 text-gray-400 mr-4"/>
                <div>
                  <p className="text-sm text-gray-500">Specialty</p>
                  <p className="font-semibold text-gray-800">{user.specialty}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Icons_1.BriefcaseIcon className="w-6 h-6 text-gray-400 mr-4"/>
                <div>
                  <p className="text-sm text-gray-500">Medical License</p>
                  <p className="font-semibold text-gray-800">{user.licenseNumber} ({user.state})</p>
                </div>
              </div>
              <div className="flex items-center">
                <Icons_1.EnvelopeIcon className="w-6 h-6 text-gray-400 mr-4"/>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Icons_1.PhoneIcon className="w-6 h-6 text-gray-400 mr-4"/>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </Card_1.default>
        </div>
      </div>
    </div>);
};
exports.default = ProviderProfile;
