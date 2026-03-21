import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import DashboardPage from './pages/applicant/DashboardPage';
import ApplyWizardPage from './pages/applicant/ApplyWizardPage';
import GrantsCatalogPage from './pages/applicant/GrantsCatalogPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationsList from './pages/admin/ApplicationsList';

// Импортируем наш защитник
import ProtectedRoute from './routes/ProtectedRoute';
import { bootstrapSession } from './features/auth/authSlice';
import { useAppDispatch } from './store/hooks';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(bootstrapSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Кабинет абитуриента (только для APPLICANT) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/apply" element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <ApplyWizardPage />
          </ProtectedRoute>
        } />
        <Route path="/catalog" element={
          <ProtectedRoute allowedRoles={['APPLICANT']}>
            <GrantsCatalogPage />
          </ProtectedRoute>
        } />

        {/* Панель администратора (только для ADMIN) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/applications" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ApplicationsList />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
