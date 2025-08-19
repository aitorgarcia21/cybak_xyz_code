import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Shield, 
  TrendingUp, 
  Calendar,
  Search,
  Eye,
  Crown,
  ArrowLeft,
  BarChart3,
  UserCheck
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAudits, setUserAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = process.env.NODE_ENV === 'production' ? 'https://cybak.xyz/api' : 'http://localhost:8080/api';

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('cybak_token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 403) {
        setError('Accès admin requis');
        return null;
      }
      throw new Error('Erreur API');
    }

    return response.json();
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [user, navigate]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadDashboardData = async () => {
    try {
      const statsData = await apiCall('/admin/stats');
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 20,
        ...(searchTerm && { search: searchTerm })
      });
      
      const data = await apiCall(`/admin/users?${params}`);
      if (data) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    }
  };

  const loadUserAudits = async (userId) => {
    try {
      const data = await apiCall(`/admin/users/${userId}/audits`);
      if (data) {
        setUserAudits(data.audits);
        setSelectedUser(data.user);
      }
    } catch (err) {
      setError('Erreur lors du chargement des audits');
    }
  };

  const promoteToAdmin = async (userId) => {
    try {
      await apiCall(`/admin/promote/${userId}`, { method: 'POST' });
      loadUsers(); // Refresh users list
    } catch (err) {
      setError('Erreur lors de la promotion');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="text-white font-bold">CYBAK Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Utilisateurs Total
                </CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.users.total}</div>
                <p className="text-xs text-slate-400">
                  +{stats.users.today} aujourd'hui
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Audits Total
                </CardTitle>
                <Shield className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.audits.total}</div>
                <p className="text-xs text-slate-400">
                  +{stats.audits.today} aujourd'hui
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Cette Semaine
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.users.week}</div>
                <p className="text-xs text-slate-400">
                  nouveaux utilisateurs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Ce Mois
                </CardTitle>
                <Calendar className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.users.month}</div>
                <p className="text-xs text-slate-400">
                  nouveaux utilisateurs
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Management */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Gestion des Utilisateurs
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                      {user.isAdmin && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Inscrit le {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadUserAudits(user.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Audits
                    </Button>
                    {!user.isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => promoteToAdmin(user.id)}
                        className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Promouvoir
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-400">
                  Page {pagination.page} sur {pagination.pages} ({pagination.total} utilisateurs)
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Précédent
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === pagination.pages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Audits Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-slate-900 border-slate-700 w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    Audits de {selectedUser.firstName} {selectedUser.lastName}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(null);
                      setUserAudits([]);
                    }}
                  >
                    ✕
                  </Button>
                </div>
                <div className="text-slate-400">{selectedUser.email}</div>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                {userAudits.length > 0 ? (
                  <div className="space-y-3">
                    {userAudits.map((audit) => (
                      <div
                        key={audit.id}
                        className="p-3 bg-slate-800 rounded border border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-white">{audit.url}</div>
                          <Badge
                            variant={audit.status === 'completed' ? 'default' : 'secondary'}
                            className={
                              audit.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }
                          >
                            {audit.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          Créé le {formatDate(audit.createdAt)}
                          {audit.completedAt && (
                            <span> • Terminé le {formatDate(audit.completedAt)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    Aucun audit trouvé pour cet utilisateur
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
