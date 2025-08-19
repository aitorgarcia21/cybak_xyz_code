import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'

// Pages
import IndexPage from './Index'
import Login from './Login'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import PricingSignup from './PricingSignup'
import PaymentSuccess from './PaymentSuccess'
import Dashboard from './Dashboard'
import Audit from './Audit'
import AuditResults from './AuditResults'
import Admin from './Admin'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import Index from './Index'
import Layout from './Layout'

export default function AppRoutes() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pricing" element={<PricingSignup />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/audit" element={
            <ProtectedRoute>
              <Layout>
                <Audit />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/audit-results" element={
            <ProtectedRoute>
              <Layout>
                <AuditResults />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
    </LanguageProvider>
  )
}
