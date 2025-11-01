"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var ToggleSwitch_1 = require("../../components/shared/ToggleSwitch");
var SystemSettings = function () {
    var _a = (0, react_1.useState)({
        squareAppId: 'sq0idp-EXAMPLE',
        twilioSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        sentryDsn: 'https://examplePublicKey@o0.ingest.sentry.io/0'
    }), apiKeys = _a[0], setApiKeys = _a[1];
    var _b = (0, react_1.useState)({
        aiAssistant: true,
        videoConsults: true,
        patientSubscriptions: false,
    }), featureFlags = _b[0], setFeatureFlags = _b[1];
    var handleApiChange = function (e) {
        var _a;
        setApiKeys(__assign(__assign({}, apiKeys), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    var handleFlagChange = function (e) {
        var _a;
        setFeatureFlags(__assign(__assign({}, featureFlags), (_a = {}, _a[e.target.name] = e.target.checked, _a)));
    };
    return (<div>
            <PageHeader_1.default title="System Settings" subtitle="Configure platform-wide integrations and features."/>
            <div className="space-y-8">
                <Card_1.default title="API Integrations">
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="squareAppId" className="block text-sm font-medium text-gray-700">Square App ID</label>
                            <input type="text" name="squareAppId" id="squareAppId" value={apiKeys.squareAppId} onChange={handleApiChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="twilioSid" className="block text-sm font-medium text-gray-700">Twilio Account SID</label>
                            <input type="text" name="twilioSid" id="twilioSid" value={apiKeys.twilioSid} onChange={handleApiChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                         <div>
                            <label htmlFor="sentryDsn" className="block text-sm font-medium text-gray-700">Sentry DSN</label>
                            <input type="text" name="sentryDsn" id="sentryDsn" value={apiKeys.sentryDsn} onChange={handleApiChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div className="text-right pt-2">
                             <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save API Keys</button>
                        </div>
                    </form>
                </Card_1.default>
                <Card_1.default title="Feature Flags">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Enable AI Health Assistant</span>
                            <ToggleSwitch_1.default name="aiAssistant" checked={featureFlags.aiAssistant} onChange={handleFlagChange}/>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Enable Video Consultations</span>
                            <ToggleSwitch_1.default name="videoConsults" checked={featureFlags.videoConsults} onChange={handleFlagChange}/>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Enable Patient Subscriptions</span>
                             <ToggleSwitch_1.default name="patientSubscriptions" checked={featureFlags.patientSubscriptions} onChange={handleFlagChange}/>
                        </div>
                    </div>
                </Card_1.default>
                <Card_1.default title="Maintenance Mode" className="bg-red-50 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-red-800">Enable Maintenance Mode</h3>
                            <p className="text-sm text-red-600">This will make the site temporarily unavailable to patients and providers.</p>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Activate</button>
                    </div>
                </Card_1.default>
            </div>
        </div>);
};
exports.default = SystemSettings;
