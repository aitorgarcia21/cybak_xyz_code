import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { createPageUrl } from '@/utils'
import { LanguageContext } from '@/components/LanguageContext'

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext) || { language: 'en' }

  const translations = {
    fr: {
      signUp: "Créer un compte",
      welcome: "Bienvenue sur CYBAK",
      description: "Créez votre compte pour commencer à sécuriser vos systèmes",
      firstName: "Prénom",
      lastName: "Nom de famille",
      email: "Adresse e-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      createAccount: "Créer mon compte",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      signIn: "Se connecter",
      backToHome: "Retour à l'accueil",
      firstNameRequired: "Le prénom est obligatoire",
      lastNameRequired: "Le nom de famille est obligatoire",
      emailRequired: "L'adresse e-mail est obligatoire",
      passwordRequired: "Le mot de passe est obligatoire",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
      passwordsNotMatch: "Les mots de passe ne correspondent pas",
      accountCreated: "Compte créé avec succès ! Consultez votre boîte e-mail pour confirmer votre inscription.",
      creating: "Création en cours...",
      emailAlreadyExists: "Cette adresse e-mail est déjà utilisée"
    },
    en: {
      signUp: "Sign up",
      welcome: "Join CYBAK",
      description: "Create your account to start your security audits",
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      createAccount: "Create my account",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign in",
      backToHome: "Back to home",
      firstNameRequired: "First name is required",
      lastNameRequired: "Last name is required",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 6 characters",
      passwordsNotMatch: "Passwords do not match",
      accountCreated: "Account created successfully! Check your email to confirm your account.",
      creating: "Creating account...",
      emailAlreadyExists: "This email address is already in use"
    }
  }

  const t = translations[language] || translations.fr

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.firstName) {
      setError(t.firstNameRequired)
      return
    }
    if (!formData.lastName) {
      setError(t.lastNameRequired)
      return
    }
    if (!formData.email) {
      setError(t.emailRequired)
      return
    }
    if (!formData.password) {
      setError(t.passwordRequired)
      return
    }
    if (formData.password.length < 6) {
      setError(t.passwordTooShort)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsNotMatch)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`
      })
      
      if (error) {
        if (error.message.includes('already registered')) {
          setError(t.emailAlreadyExists)
        } else {
          setError(error.message)
        }
        return
      }

      if (data.error) {
        setError(data.error)
      } else {
        setSuccess(t.accountCreated)
        setTimeout(() => {
          navigate(createPageUrl('PricingSignup'))
        }, 2000)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 animate-gradient-shift"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)`
        }}></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23334155' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded p-1"
            aria-label={t.backToHome}
          >
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
            {t.backToHome}
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {t.signUp}
                </CardTitle>
                <p className="text-xl text-slate-300 mb-2">
                  {t.welcome}
                </p>
                <p className="text-slate-400">
                  {t.description}
                </p>
              </motion.div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="bg-red-900/20 border-red-500 text-red-400" role="alert" aria-live="polite">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-500 text-green-400" role="alert" aria-live="polite">
                    <AlertDescription className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" aria-hidden="true" />
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <motion.div 
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-300 mb-2">
                      {t.firstName} *
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" aria-hidden="true" />
                      <Input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-600 text-white pl-10 h-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 hover:border-slate-500"
                        placeholder={t.firstName}
                        required
                        aria-required="true"
                        aria-label={t.firstName}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-300 mb-2">
                      {t.lastName} *
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" aria-hidden="true" />
                      <Input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-600 text-white pl-10 h-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 hover:border-slate-500"
                        placeholder={t.lastName}
                        required
                        aria-required="true"
                        aria-label={t.lastName}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.email} *
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white pl-10 h-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 hover:border-slate-500"
                      placeholder="exemple@email.com"
                      required
                      aria-required="true"
                      aria-label={t.email}
                      aria-describedby="email-error"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.password} *
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white pl-10 pr-12 h-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 hover:border-slate-500"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      aria-label={t.password}
                      aria-describedby="password-requirements"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md p-1 transition-colors"
                      aria-label={showPassword ? t.hidePassword : t.showPassword}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300 mb-2">
                    {t.confirmPassword} *
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" aria-hidden="true" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white pl-10 pr-12 h-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 hover:border-slate-500"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      aria-label={t.confirmPassword}
                      aria-describedby="confirm-password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md p-1 transition-colors"
                      aria-label={showConfirmPassword ? t.hidePassword : t.showPassword}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        {t.creating}
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Shield className="w-5 h-5 mr-2" />
                        {t.createAccount}
                      </span>
                    )}
                  </Button>
                </motion.div>

                <motion.div 
                  className="text-center pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <p className="text-slate-400">
                    {t.alreadyHaveAccount}{' '}
                    <Link 
                      to={createPageUrl('Login')}
                      className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 font-semibold hover:underline"
                    >
                      {t.signIn}
                    </Link>
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
