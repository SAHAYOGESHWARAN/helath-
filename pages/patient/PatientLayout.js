"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("../../components/layout/Sidebar");
var Header_1 = require("../../components/layout/Header");
var constants_1 = require("../../constants");
var PatientDashboard_1 = require("../../pages/patient/PatientDashboard");
var Appointments_1 = require("../../pages/patient/Appointments");
var HealthRecords_1 = require("../../pages/patient/HealthRecords");
var Messaging_1 = require("../../pages/patient/Messaging");
var VideoConsults_1 = require("../../pages/patient/VideoConsults");
var Claims_1 = require("../../pages/patient/Claims");
var Payments_1 = require("../../pages/patient/Payments");
var Subscription_1 = require("../../pages/patient/Subscription");
var AI_Assistant_1 = require("../../pages/patient/AI_Assistant");
var Profile_1 = require("../../pages/patient/Profile");
var Settings_1 = require("../../pages/patient/Settings");
var VisitHistory_1 = require("../../pages/patient/VisitHistory");
var Medications_1 = require("../../pages/patient/Medications");
var TaskList_1 = require("../../pages/patient/TaskList");
var HealthGoalsPage_1 = require("../../pages/patient/HealthGoalsPage");
var PatientLayout = function () {
    return (<div className="flex h-screen bg-white font-sans">
      <Sidebar_1.default navItems={constants_1.PATIENT_NAV}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header_1.default />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="animate-slide-in-up">
            <react_router_dom_1.Routes>
              <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
              <react_router_dom_1.Route path="/dashboard" element={<PatientDashboard_1.default />}/>
              <react_router_dom_1.Route path="/appointments" element={<Appointments_1.default />}/>
              <react_router_dom_1.Route path="/emr" element={<HealthRecords_1.default />}/>
              <react_router_dom_1.Route path="/medications" element={<Medications_1.default />}/>
              <react_router_dom_1.Route path="/goals" element={<HealthGoalsPage_1.default />}/>
              <react_router_dom_1.Route path="/tasks" element={<TaskList_1.default />}/>
              <react_router_dom_1.Route path="/history" element={<VisitHistory_1.default />}/>
              <react_router_dom_1.Route path="/messaging" element={<Messaging_1.default />}/>
              <react_router_dom_1.Route path="/video-consults" element={<VideoConsults_1.default />}/>
              <react_router_dom_1.Route path="/claims" element={<Claims_1.default />}/>
              <react_router_dom_1.Route path="/payments" element={<Payments_1.default />}/>
              <react_router_dom_1.Route path="/subscription" element={<Subscription_1.default />}/>
              <react_router_dom_1.Route path="/ai-assistant" element={<AI_Assistant_1.default />}/>
              <react_router_dom_1.Route path="/profile" element={<Profile_1.default />}/>
              <react_router_dom_1.Route path="/settings" element={<Settings_1.default />}/>
              <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
            </react_router_dom_1.Routes>
          </div>
        </main>
      </div>
    </div>);
};
exports.default = PatientLayout;
