
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { PROVIDER_NAV } from '../../constants';
import ProviderDashboard from '../../pages/provider/ProviderDashboard';
import ProviderAppointments from '../../pages/provider/ProviderAppointments';
import PatientManagement from '../../pages/provider/PatientManagement';
import ProviderCalendar from '../../pages/provider/ProviderCalendar';
import ProgressNotes from '../../pages/provider/ProgressNotes';
import EPrescribing from '../../pages/provider/EPrescribing';
import Referrals from '../../pages/provider/Referrals';
import Billing from '../../pages/provider/Billing';
import ProviderReports from '../../pages/provider/ProviderReports';
import WaitingRoom from '../../pages/provider/WaitingRoom';

const ProviderLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar navItems={PROVIDER_NAV} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProviderDashboard />} />
            <Route path="/calendar" element={<ProviderCalendar />} />
            <Route path="/appointments" element={<ProviderAppointments />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/progress-notes" element={<ProgressNotes />} />
            <Route path="/e-prescribing" element={<EPrescribing />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<ProviderReports />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
