import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Check, ArrowLeft, CreditCard, Zap, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { createPageUrl } from '@/utils'
import { LanguageContext } from '@/components/LanguageContext'
import { CYBAK_PRICE, createCheckoutSession } from '@/lib/stripe'

export default function PricingSignup() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext) || { language: 'en' }

  const translations = {
    fr: {
      chooseYourPlan: "Choisissez votre plan CYBAK",
      subtitle: "Commencez votre audit de sécurité dès maintenant",
      monthly: "Mensuel",
      yearly: "Annuel",
      mostPopular: "Le plus populaire",
      bestValue: "Meilleure valeur",
      perMonth: "/mois",
      perYear: "/an",
      save2Months: "Économisez 2 mois",
      features: {
        unlimited: "Audits de sécurité illimités",
        advanced: "Tests avancés (500+ vérifications)",
        reports: "Rapports PDF détaillés",
        priority: "Support prioritaire 24/7",
        api: "Accès API complet",
        updates: "Mises à jour en temps réel"
      },
      startTrial: "Commencer l'abonnement",
      processing: "Traitement en cours...",
      backToSignup: "Retour à l'inscription",
      guarantee: "Garantie satisfait ou remboursé 30 jours",
      secure: "Paiement 100% sécurisé avec Stripe",
      noCommitment: "Annulation à tout moment",
      loginRequired: "Vous devez d'abord créer un compte"
    },
    en: {
      chooseYourPlan: "Choose your CYBAK plan",
      subtitle: "Start your security audit right now",
      monthly: "Monthly",
      yearly: "Yearly",
      mostPopular: "Most popular",
      bestValue: "Best value",
      perMonth: "/month",
      perYear: "/year",
      save2Months: "Save 2 months",
      features: {
        unlimited: "Unlimited security audits",
        advanced: "Advanced tests (500+ checks)",
        reports: "Detailed PDF reports",
        priority: "24/7 priority support",
        api: "Full API access",
        updates: "Real-time updates"
      },
      startTrial: "Start subscription",
      processing: "Processing...",
      backToSignup: "Back to signup",
      guarantee: "30-day money-back guarantee",
      secure: "100% secure payment with Stripe",
      noCommitment: "Cancel anytime",
      loginRequired: "You must create an account first"
    }
  }

  const t = translations[language] || translations.fr

  const handleSubscribe = async () => {
    if (!user) {
      setError(t.loginRequired)
      setTimeout(() => navigate(createPageUrl('SignUp')), 2000)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await createCheckoutSession(
        CYBAK_PRICE.id,
        user.email,
        user.id
      )

      if (result.error) {
        setError(result.error)
      }
      // Si succès, l'utilisateur sera redirigé vers Stripe
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const plan = {
    name: 'CYBAK Premium',
    price: '4,99',
    period: t.perMonth,
    features: [
      t.features.unlimited,
      t.features.advanced,
      t.features.reports,
      t.features.priority,
      t.features.api,
      t.features.updates
    ]
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

      <div className="relative z-10 w-full max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            to={createPageUrl('SignUp')}
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToSignup}
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cybak-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.chooseYourPlan}
          </h1>
          <p className="text-slate-300">
            {t.subtitle}
          </p>
        </motion.div>

        {error && (
          <Alert className="bg-red-900/20 border-red-500/30 text-red-400 mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="relative bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow ring-2 ring-cyan-500/50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </div>
              </div>

              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="mb-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">€{plan.price}</span>
                    <span className="text-slate-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t.processing}
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t.startTrial}
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-400" />
              {t.secure}
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              {t.noCommitment}
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {t.guarantee}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
