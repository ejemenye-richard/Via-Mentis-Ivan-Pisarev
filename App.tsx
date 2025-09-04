import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import SessionView from './pages/SessionView';
import PsychologistDashboard from './pages/PsychologistDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Onboarding from './pages/Onboarding';
import { VoiceControlProvider } from './context/VoiceControlContext';
import VoiceControlIndicator from './components/VoiceControlIndicator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      <HashRouter>
        <VoiceControlProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/student/home" element={<StudentDashboard />} />
            <Route path="/student/session/:id" element={<SessionView />} />
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/psychologist/dashboard" element={<PsychologistDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <VoiceControlIndicator />
        </VoiceControlProvider>
      </HashRouter>
    </div>
  );
};

export default App;
