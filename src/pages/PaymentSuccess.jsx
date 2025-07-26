import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Shield, ArrowRight, Download, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { createPageUrl } from '@/utils'
import { LanguageContext } from '@/components/LanguageContext'
import { checkPaymentStatus } from '@/lib/stripe'
import { updateUserSubscription } from '@/lib/supabase'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState('')
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext) || { language: 'fr' }

  const sessionId = searchParams.get('session_id')

  const translations = {
    fr: {
      paymentSuccess: "Paiement réussi !",
      welcome: "Bienvenue dans CYBAK Premium",
      subtitle: "Votre abonnement est maintenant actif",
      verifying: "Vérification du paiement en cours...",
      subscriptionActive: "Abonnement activé avec succès",
      features: {
        unlimited: "Audits de sécurité illimités",
        advanced: "500+ tests de sécurité avancés",
        reports: "Rapports PDF détaillés",
        priority: "Support prioritaire 24/7",
        api: "Accès API complet"
      },
      startScanning: "Commencer les audits",
      goToDashboard: "Accéder au tableau de bord",
      downloadReceipt: "Télécharger le reçu",
      nextSteps: "Prochaines étapes :",
      step1: "Explorez votre tableau de bord",
      step2: "Lancez votre premier audit de sécurité",
      step3: "Consultez vos rapports détaillés",
      thankYou: "Merci de faire confiance à CYBAK !",
      support: "Une question ? Notre équipe est là pour vous aider.",
      error: "Erreur lors de la vérification du paiement"
    },
    en: {
      paymentSuccess: "Payment successful!",
      welcome: "Welcome to CYBAK Premium",
      subtitle: "Your subscription is now active",
      verifying: "Verifying payment...",
      subscriptionActive: "Subscription activated successfully",
      features: {
        unlimited: "Unlimited security audits",
        advanced: "500+ advanced security tests",
        reports: "Detailed PDF reports",
        priority: "24/7 priority support",
        api: "Full API access"
      },
      startScanning: "Start auditing",
      goToDashboard: "Go to dashboard",
      downloadReceipt: "Download receipt",
      nextSteps: "Next steps:",
      step1: "Explore your dashboard",
      step2: "Launch your first security audit",
      step3: "Review your detailed reports",
      thankYou: "Thank you for trusting CYBAK!",
      support: "Questions? Our team is here to help.",
      error: "Error verifying payment"
    }
  }

  const t = translations[language] || translations.fr

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Session ID manquant')
        setIsLoading(false)
        return
      }

      try {
        // Vérifier le statut du paiement avec Stripe
        const paymentResult = await checkPaymentStatus(sessionId)
        
        if (paymentResult.error) {
          setError(paymentResult.error)
          return
        }

        if (paymentResult.payment_status === 'paid') {
          // Mettre à jour le statut d'abonnement dans Supabase
          if (user) {
            await updateUserSubscription(user.id, {
              subscription_status: 'active',
              stripe_customer_id: paymentResult.customer_id,
              stripe_subscription_id: paymentResult.subscription_id,
              plan_type: paymentResult.plan_type || 'monthly',
              subscription_start: new Date().toISOString(),
              subscription_end: paymentResult.subscription_end
            })
            
            // Rafraîchir les données utilisateur
            await refreshUser()
          }

          setPaymentData(paymentResult)
        } else {
          setError('Le paiement n\'a pas été confirmé')
        }
      } catch (err) {
        console.error('Erreur lors de la vérification:', err)
        setError(err.message || 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, user, refreshUser])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300">{t.verifying}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6 text-center">
            <Alert className="bg-red-900/20 border-red-500/30 text-red-400 mb-4">
              <AlertDescription>{t.error}: {error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="w-full"
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"></div>
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

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center cybak-glow"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <CardTitle className="text-2xl text-white mb-2">
                {t.paymentSuccess}
              </CardTitle>
              
              <div className="space-y-2">
                <h2 className="text-xl text-cyan-400 font-semibold">
                  {t.welcome}
                </h2>
                <p className="text-slate-300">
                  {t.subtitle}
                </p>
              </div>

              <Alert className="bg-green-900/20 border-green-500/30 text-green-400 mt-4">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>{t.subscriptionActive}</AlertDescription>
              </Alert>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Fonctionnalités activées
                </h3>
                <ul className="space-y-2">
                  {Object.values(t.features).map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t.nextSteps}
                </h3>
                <ol className="space-y-2">
                  <li className="flex items-center text-slate-300">
                    <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    {t.step1}
                  </li>
                  <li className="flex items-center text-slate-300">
                    <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    {t.step2}
                  </li>
                  <li className="flex items-center text-slate-300">
                    <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    {t.step3}
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => navigate(createPageUrl('Dashboard'))}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t.goToDashboard}
                </Button>
                
                <Button
                  onClick={() => navigate(createPageUrl('Audit'))}
                  variant="outline"
                  className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                >
                  {t.startScanning}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {paymentData?.receipt_url && (
                <Button
                  onClick={() => window.open(paymentData.receipt_url, '_blank')}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.downloadReceipt}
                </Button>
              )}

              {/* Thank you message */}
              <div className="text-center pt-4 border-t border-slate-700">
                <p className="text-slate-300 mb-2">{t.thankYou}</p>
                <p className="text-sm text-slate-400">{t.support}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
