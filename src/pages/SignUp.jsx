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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="border-r border-cyan-500/20"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cybak-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">
                {t.signUp}
              </CardTitle>
              <p className="text-slate-300">
                {t.welcome}
              </p>
              <p className="text-sm text-slate-400">
                {t.description}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="bg-red-900/20 border-red-500/30 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-500/30 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white font-medium text-sm">
                      {t.firstName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 pl-10"
                        placeholder="John"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white font-medium text-sm">
                      {t.lastName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 pl-10"
                        placeholder="Doe"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium text-sm">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 pl-10"
                      placeholder="votre@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium text-sm">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 pl-10 pr-10"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium text-sm">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 pl-10 pr-10"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t.creating}
                    </div>
                  ) : (
                    t.createAccount
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm">
                    {t.alreadyHaveAccount}{' '}
                    <Link 
                      to={createPageUrl('Login')}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                    >
                      {t.signIn}
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
