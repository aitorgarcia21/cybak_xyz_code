import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { createPageUrl } from '@/utils'
import { LanguageContext } from '@/components/LanguageContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext) || { language: 'en' }

  const translations = {
    fr: {
      login: "Connexion",
      welcome: "Bon retour sur CYBAK",
      description: "Connectez-vous à votre compte pour accéder à vos audits de sécurité",
      email: "Adresse email",
      password: "Mot de passe",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      signIn: "Se connecter",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Pas encore de compte ?",
      signUp: "Créer un compte",
      backToHome: "Retour à l'accueil",
      invalidCredentials: "Email ou mot de passe incorrect",
      emailRequired: "L'email est requis",
      passwordRequired: "Le mot de passe est requis",
      signingIn: "Connexion en cours..."
    },
    en: {
      login: "Login",
      welcome: "Welcome back to CYBAK",
      description: "Sign in to your account to access your security audits",
      email: "Email address",
      password: "Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      signIn: "Sign in",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      backToHome: "Back to home",
      invalidCredentials: "Invalid email or password",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      signingIn: "Signing in..."
    }
  }

  const t = translations[language] || translations.fr

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email) {
      setError(t.emailRequired)
      return
    }
    if (!password) {
      setError(t.passwordRequired)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        setError(error.message === 'Invalid login credentials' ? t.invalidCredentials : error.message)
        return
      }

      // Redirect to dashboard on success
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

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
            {t.backToHome}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <motion.div 
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                {t.welcome}
              </CardTitle>
              <p className="text-slate-400 mt-2">
                {t.description}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <label htmlFor="email" className="text-slate-300 font-medium">
                      {t.email}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                      placeholder="votre@email.com"
                      disabled={isLoading}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label htmlFor="password" className="text-slate-300 font-medium">
                      {t.password}
                    </label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 pr-10 transition-all duration-200"
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t.signingIn}
                      </div>
                    ) : (
                      t.signIn
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    {t.noAccount}{' '}
                    <Link 
                      to="/signup"
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      {t.signUp}
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
