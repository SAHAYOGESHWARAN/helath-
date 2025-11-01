"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("./Sidebar");
var Header_1 = require("./Header");
var constants_1 = require("../../constants");
var ProviderDashboard_1 = require("../../pages/provider/ProviderDashboard");
var ProviderCalendar_1 = require("../../pages/provider/ProviderCalendar");
var ProviderAppointments_1 = require("../../pages/provider/ProviderAppointments");
var PatientManagement_1 = require("../../pages/provider/PatientManagement");
var ProgressNotes_1 = require("../../pages/provider/ProgressNotes");
var EPrescribing_1 = require("../../pages/provider/EPrescribing");
var Referrals_1 = require("../../pages/provider/Referrals");
var Billing_1 = require("../../pages/provider/Billing");
var Subscription_1 = require("../../pages/provider/Subscription");
var ProviderReports_1 = require("../../pages/provider/ProviderReports");
var WaitingRoom_1 = require("../../pages/provider/WaitingRoom");
var ProviderProfile_1 = require("../../pages/provider/ProviderProfile");
var ProviderSettings_1 = require("../../pages/provider/ProviderSettings");
var PatientChart_1 = require("../../pages/provider/PatientChart");
var LabOrders_1 = require("../../pages/provider/LabOrders");
var Messaging_1 = require("../../pages/provider/Messaging");
var Inbox_1 = require("../../pages/provider/Inbox");
var ProviderLayout = function () {
    return (<div className="flex h-screen bg-white font-sans">
      <Sidebar_1.default navItems={constants_1.PROVIDER_NAV}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header_1.default />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-50">
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/patients" replace/>}/>
            <react_router_dom_1.Route path="/dashboard" element={<ProviderDashboard_1.default />}/>
            <react_router_dom_1.Route path="/calendar" element={<ProviderCalendar_1.default />}/>
            <react_router_dom_1.Route path="/appointments" element={<ProviderAppointments_1.default />}/>
            <react_router_dom_1.Route path="/patients" element={<PatientManagement_1.default />}/>
            <react_router_dom_1.Route path="/patients/:patientId" element={<PatientChart_1.default />}/>
            <react_router_dom_1.Route path="/progress-notes" element={<ProgressNotes_1.default />}/>
            <react_router_dom_1.Route path="/e-prescribing" element={<EPrescribing_1.default />}/>
            <react_router_dom_1.Route path="/lab-orders" element={<LabOrders_1.default />}/>
            <react_router_dom_1.Route path="/referrals" element={<Referrals_1.default />}/>
            <react_router_dom_1.Route path="/messaging" element={<Messaging_1.default />}/>
            <react_router_dom_1.Route path="/inbox" element={<Inbox_1.default />}/>
            <react_router_dom_1.Route path="/billing" element={<Billing_1.default />}/>
            <react_router_dom_1.Route path="/subscription" element={<Subscription_1.default />}/>
            <react_router_dom_1.Route path="/reports" element={<ProviderReports_1.default />}/>
            <react_router_dom_1.Route path="/waiting-room" element={<WaitingRoom_1.default />}/>
            <react_router_dom_1.Route path="/profile" element={<ProviderProfile_1.default />}/>
            <react_router_dom_1.Route path="/settings" element={<ProviderSettings_1.default />}/>
            <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/patients" replace/>}/>
          </react_router_dom_1.Routes>
        </main>
      </div>
    </div>);
};
exports.default = ProviderLayout;
