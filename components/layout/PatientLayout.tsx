
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { PATIENT_NAV } from '../../constants';
import PatientDashboard from '../../pages/patient/PatientDashboard';
import PatientAppointments from '../../pages/patient/Appointments';
import EMR from '../../pages/patient/HealthRecords';
import Medications from '../../pages/patient/Medications';
import Messaging from '../../pages/patient/Messaging';
import VideoConsults from '../../pages/patient/VideoConsults';
import Claims from '../../pages/patient/Claims';
import Payments from '../../pages/patient/Payments';
import Subscription from '../../pages/patient/Subscription';
import AIHealthGuide from '../../pages/patient/AI_Assistant';
import Profile from '../../pages/patient/Profile';
import Settings from '../../pages/patient/Settings';
import VisitHistory from '../../pages/patient/VisitHistory';


const PatientLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar navItems={PATIENT_NAV} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="animate-slide-in-up">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/appointments" element={<PatientAppointments />} />
              <Route path="/emr" element={<EMR />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/history" element={<VisitHistory />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/video-consults" element={<VideoConsults />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/ai-assistant" element={<AIHealthGuide />} />
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