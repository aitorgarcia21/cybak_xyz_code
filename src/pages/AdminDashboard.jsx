import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  RefreshCw, 
  Search,
  UserPlus,
  TrendingUp,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const navigate = useNavigate()

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('cybak_token')
      if (!token) {
        navigate('/admin/login')
        return
      }

      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 403) {
        navigate('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs')
      }

      const data = await response.json()
      setUsers(data.users)
      setLastUpdate(new Date())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // Fonction pour récupérer les statistiques
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('cybak_token')
      const response = await fetch('http://localhost:8080/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Erreur stats:', err)
    }
  }

  // Charger les données au montage et toutes les 10 secondes
  useEffect(() => {
    fetchUsers()
    fetchStats()
    setIsLoading(false)

    // Auto-refresh toutes les 10 secondes
    const interval = setInterval(() => {
      fetchUsers()
      fetchStats()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              Dashboard Admin CYBAK
            </h1>
            <Button
              onClick={() => {
                fetchUsers()
                fetchStats()
              }}
              variant="outline"
              className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
          <p className="text-slate-400">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </motion.div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Utilisateurs
                </CardTitle>
                <Users className="w-4 h-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-slate-400 mt-1">
                  <Activity className="w-3 h-3 inline mr-1" />
                  Actifs sur la plateforme
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Cette Semaine
                </CardTitle>
                <UserPlus className="w-4 h-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.newUsersThisWeek}</div>
                <p className="text-xs text-slate-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Nouveaux inscrits
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Ce Mois
                </CardTitle>
                <Calendar className="w-4 h-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.newUsersThisMonth}</div>
                <p className="text-xs text-slate-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Croissance mensuelle
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Barre de recherche */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par email, nom ou prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
            />
          </div>
        </motion.div>

        {/* Tableau des utilisateurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Liste des Utilisateurs ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Nom</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Prénom</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Date d'inscription</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr 
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="text-white">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {user.lastName || '-'}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {user.firstName || '-'}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                Utilisateur
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur inscrit'}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Indicateur de mise à jour automatique */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-sm text-slate-400"
        >
          <Activity className="w-4 h-4 inline mr-2 text-green-400" />
          Actualisation automatique toutes les 10 secondes
        </motion.div>
      </div>
    </div>
  )
}
