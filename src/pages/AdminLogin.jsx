import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Crown, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Si l'utilisateur est déjà connecté et admin, rediriger vers admin
    if (user?.isAdmin) {
      navigate('/admin');
    } else if (user && !user.isAdmin) {
      // Si connecté mais pas admin, déconnecter et afficher erreur
      setError('Accès administrateur requis');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await signIn(formData.email, formData.password);
      
      if (authError) {
        setError(authError.message || 'Erreur de connexion');
        return;
      }

      // Vérifier si l'utilisateur est admin
      if (!data.user?.user_metadata?.isAdmin && !data.user?.app_metadata?.isAdmin) {
        setError('Accès administrateur requis. Seuls les administrateurs peuvent accéder à cette interface.');
        return;
      }

      // Redirection vers l'interface admin
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23334155%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              Administration CYBAK
            </CardTitle>
            <p className="text-slate-400 mt-2">
              Interface réservée aux administrateurs
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Adresse e-mail administrateur
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                    placeholder="admin@cybak.xyz"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-300 font-medium">
                    Mot de passe administrateur
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Accéder à l'administration
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Connexion utilisateur ?{' '}
                  <Link 
                    to="/login" 
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Interface utilisateur
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">
            🔒 Interface sécurisée - Accès limité aux administrateurs autorisés
          </p>
        </div>
      </div>
    </div>
  );
}
