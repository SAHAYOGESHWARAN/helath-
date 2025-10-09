
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { PATIENT_NAV } from '../../constants';
import PatientDashboard from '../../pages/patient/PatientDashboard';
import PatientAppointments from '../../pages/patient/Appointments';
import HealthRecords from '../../pages/patient/HealthRecords';
import Medications from '../../pages/patient/Medications';
import Messaging from '../../pages/patient/Messaging';
import VideoConsults from '../../pages/patient/VideoConsults';
import Claims from '../../pages/patient/Claims';
import Payments from '../../pages/patient/Payments';
import Insurance from '../../pages/patient/Insurance';
import Subscription from '../../pages/patient/Subscription';
import AI_Assistant from '../../pages/patient/AI_Assistant';
import Profile from '../../pages/patient/Profile';
import Settings from '../../pages/patient/Settings';


const PatientLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar navItems={PATIENT_NAV} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="animate-slide-in-up">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/appointments" element={<PatientAppointments />} />
              <Route path="/records" element={<HealthRecords />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/video-consults" element={<VideoConsults />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/ai-assistant" element={<AI_Assistant />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;