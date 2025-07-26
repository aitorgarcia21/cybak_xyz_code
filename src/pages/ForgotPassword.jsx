import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { createPageUrl } from '@/utils'
import { LanguageContext } from '@/components/LanguageContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()
  const { language } = useContext(LanguageContext) || { language: 'fr' }

  const translations = {
    fr: {
      forgotPassword: "Mot de passe oublié",
      title: "Réinitialiser votre mot de passe",
      description: "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe",
      email: "Adresse email",
      sendReset: "Envoyer le lien",
      backToLogin: "Retour à la connexion",
      emailRequired: "L'email est requis",
      resetSent: "Un email de réinitialisation a été envoyé ! Vérifiez votre boîte de réception.",
      sending: "Envoi en cours...",
      emailNotFound: "Aucun compte trouvé avec cette adresse email"
    },
    en: {
      forgotPassword: "Forgot password",
      title: "Reset your password",
      description: "Enter your email address and we'll send you a link to reset your password",
      email: "Email address",
      sendReset: "Send reset link",
      backToLogin: "Back to login",
      emailRequired: "Email is required",
      resetSent: "A password reset email has been sent! Check your inbox.",
      sending: "Sending...",
      emailNotFound: "No account found with this email address"
    }
  }

  const t = translations[language] || translations.fr

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError(t.emailRequired)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await resetPassword(email)
      
      if (error) {
        if (error.message.includes('not found')) {
          setError(t.emailNotFound)
        } else {
          setError(error.message)
        }
        return
      }

      setSuccess(t.resetSent)
      setEmail('')
      
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
        {/* Back to login button */}
        <div className="mb-6">
          <Link 
            to={createPageUrl('Login')}
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToLogin}
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
                {t.forgotPassword}
              </CardTitle>
              <p className="text-slate-300">
                {t.title}
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

                <div className="space-y-2">
                  <label className="text-white font-medium text-sm">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 pl-10"
                      placeholder="votre@email.com"
                      disabled={isLoading}
                    />
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
                      {t.sending}
                    </div>
                  ) : (
                    t.sendReset
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
