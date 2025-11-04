
import React from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { PROVIDER_NAV } from '../../constants';
import ProviderDashboard from '../../pages/provider/ProviderDashboard';
import ProviderCalendar from '../../pages/provider/ProviderCalendar';
import ProviderAppointments from '../../pages/provider/ProviderAppointments';
import PatientManagement from '../../pages/provider/PatientManagement';
import ProgressNotes from '../../pages/provider/ProgressNotes';
import EPrescribing from '../../pages/provider/EPrescribing';
import Referrals from '../../pages/provider/Referrals';
import ProviderBilling from '../../pages/provider/Billing';
import ProviderSubscription from '../../pages/provider/Subscription';
import ProviderReports from '../../pages/provider/ProviderReports';
import WaitingRoom from '../../pages/provider/WaitingRoom';
import ProviderProfile from '../../pages/provider/ProviderProfile';
import ProviderSettings from '../../pages/provider/ProviderSettings';
import PatientChart from '../../pages/provider/PatientChart';
import LabOrders from '../../pages/provider/LabOrders';
import Messaging from '../../pages/provider/Messaging';
import Inbox from '../../pages/provider/Inbox';

const ProviderLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar navItems={PROVIDER_NAV} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-50">
          <Routes>
            <Route path="/" element={<Navigate to="patients" replace />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="calendar" element={<ProviderCalendar />} />
            <Route path="appointments" element={<ProviderAppointments />} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="patients/:patientId" element={<PatientChart />} />
            <Route path="progress-notes" element={<ProgressNotes />} />
            <Route path="e-prescribing" element={<EPrescribing />} />
            <Route path="lab-orders" element={<LabOrders />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="messaging" element={<Messaging />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="billing" element={<ProviderBilling />} />
            <Route path="subscription" element={<ProviderSubscription />} />
            <Route path="reports" element={<ProviderReports />} />
            <Route path="waiting-room" element={<WaitingRoom />} />
            <Route path="profile" element={<ProviderProfile />} />
            <Route path="settings" element={<ProviderSettings />} />
            <Route path="*" element={<Navigate to="patients" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;