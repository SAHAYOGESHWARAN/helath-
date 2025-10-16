
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ADMIN_NAV } from '../../constants';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import UserManagement from '../../pages/admin/UserManagement';
import SubscriptionManagement from '../../pages/admin/SubscriptionManagement';
import ProductManagement from '../../pages/admin/ProductManagement';
import Billing from '../../pages/admin/Billing';
import AdminReports from '../../pages/admin/AdminReports';
import Compliance from '../../pages/admin/Compliance';
import EnterpriseSettings from '../../pages/admin/EnterpriseSettings';
import SystemSettings from '../../pages/admin/SystemSettings';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar navItems={ADMIN_NAV} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-50">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/subscriptions" element={<SubscriptionManagement />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/enterprise" element={<EnterpriseSettings />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;