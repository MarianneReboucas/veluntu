import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import Destinations from './pages/public/Destinations';
import Packages from './pages/public/Packages';
import PackageDetail from './pages/public/PackageDetail';
import PlanTrip from './pages/public/PlanTrip';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Overview from './pages/dashboard/Overview';
import PackagesAdmin from './pages/dashboard/PackagesAdmin';
import ReservationsAdmin from './pages/dashboard/ReservationsAdmin';
import Settings from './pages/dashboard/Settings';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a12] flex items-center justify-center text-[#d4af37]">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between bg-[#080c16]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/destinos" element={<PublicLayout><Destinations /></PublicLayout>} />
          <Route path="/destinos/:id" element={<PublicLayout><Destinations /></PublicLayout>} />
          <Route path="/pacotes" element={<PublicLayout><Packages /></PublicLayout>} />
          <Route path="/pacotes/:id" element={<PublicLayout><PackageDetail /></PublicLayout>} />
          <Route path="/planejar" element={<PublicLayout><PlanTrip /></PublicLayout>} />
          <Route path="/contato" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/registro" element={<PublicLayout><Register /></PublicLayout>} />

          {/* SaaS Dashboard Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pacotes"
            element={
              <ProtectedRoute>
                <PackagesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reservas"
            element={
              <ProtectedRoute>
                <ReservationsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/estatisticas"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/configuracoes"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
