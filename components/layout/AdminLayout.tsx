"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("./Sidebar");
var Header_1 = require("./Header");
var constants_1 = require("../../constants");
var AdminDashboard_1 = require("../../pages/admin/AdminDashboard");
var UserManagement_1 = require("../../pages/admin/UserManagement");
var SubscriptionManagement_1 = require("../../pages/admin/SubscriptionManagement");
var ProductManagement_1 = require("../../pages/admin/ProductManagement");
var Billing_1 = require("../../pages/admin/Billing");
var AdminReports_1 = require("../../pages/admin/AdminReports");
var Compliance_1 = require("../../pages/admin/Compliance");
var EnterpriseSettings_1 = require("../../pages/admin/EnterpriseSettings");
var SystemSettings_1 = require("../../pages/admin/SystemSettings");
var AdminLayout = function () {
    return (<div className="flex h-screen bg-white font-sans">
      <Sidebar_1.default navItems={constants_1.ADMIN_NAV}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header_1.default />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-50">
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
            <react_router_dom_1.Route path="/dashboard" element={<AdminDashboard_1.default />}/>
            <react_router_dom_1.Route path="/users" element={<UserManagement_1.default />}/>
            <react_router_dom_1.Route path="/subscriptions" element={<SubscriptionManagement_1.default />}/>
            <react_router_dom_1.Route path="/plans" element={<ProductManagement_1.default />}/>
            <react_router_dom_1.Route path="/billing" element={<Billing_1.default />}/>
            <react_router_dom_1.Route path="/reports" element={<AdminReports_1.default />}/>
            <react_router_dom_1.Route path="/compliance" element={<Compliance_1.default />}/>
            <react_router_dom_1.Route path="/enterprise" element={<EnterpriseSettings_1.default />}/>
            <react_router_dom_1.Route path="/settings" element={<SystemSettings_1.default />}/>
            <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
          </react_router_dom_1.Routes>
        </main>
      </div>
    </div>);
};
exports.default = AdminLayout;
