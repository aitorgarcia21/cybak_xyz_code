import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Vérification des permissions...</div>
      </div>
    );
  }

  // Si pas connecté, rediriger vers la page de connexion admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si connecté mais pas admin, rediriger vers la page de connexion admin avec erreur
  if (!user.isAdmin && !user.user_metadata?.isAdmin && !user.app_metadata?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
