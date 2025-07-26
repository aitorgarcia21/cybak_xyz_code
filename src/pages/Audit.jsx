
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ArrowLeft, 
  Play, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Lock,
  Globe,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

import ScanningAnimation from "../components/audit/ScanningAnimation";
import ResultsDisplay from "../components/audit/ResultsDisplay";
import { LanguageContext } from "@/context/LanguageContext"; // Added import

export default function AuditPage() {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [currentAudit, setCurrentAudit] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, completed, error
  const [currentStep, setCurrentStep] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState('idle'); // idle, verifying, success, error
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { language } = useContext(LanguageContext) || { language: 'en' }; // Changed default language to 'en'

  const translations = {
    fr: {
      newAudit: "Lancer un nouvel audit",
      auditDescription: "Découvrez les vulnérabilités de votre site en moins de 2 minutes",
      websiteUrl: "URL de votre site web",
      start: "Démarrer",
      scanInProgress: "Analyse en cours...",
      auditCompleted: "Audit terminé !",
      auditError: "Erreur lors de l'audit",
      errorDescription: "Une erreur s'est produite lors de l'analyse. Veuillez réessayer ou contacter le support.",
      retry: "Réessayer",
      newAuditButton: "Nouvel audit",
      loading: "Chargement...",
      paymentConfirmed: "Paiement confirmé !",
      accountCreation: "Création de votre compte CYBAK en cours...",
      redirectMessage: "Vous allez être redirigé vers votre tableau de bord dans un instant.",
      activationInProgress: "Activation en cours",
      activationMessage: "Votre paiement a été reçu ! L'activation de votre compte CYBAK peut prendre quelques minutes.\n\nSi vous avez été débité, votre accès sera activé automatiquement.",
      accessDashboard: "Accéder au tableau de bord",
      subscriptionInactive: "Votre abonnement n'est plus actif.",
      subscriptionPrompt: "Pour lancer de nouveaux audits et accéder à toutes les fonctionnalités, veuillez réactiver votre abonnement.",
      benefits: "✅ Audits illimités\n✅ Rapports PDF détaillés\n✅ Support prioritaire",
      continuePayment: "Continuer vers la page de paiement sécurisé ?",
      authError: "Une erreur s'est produite. Veuillez vous connecter d'abord ou réessayer.",
      scanStep1: "Analyse de la configuration HTTPS...",
      scanStep2: "Vérification des en-têtes de sécurité...",
      scanStep3: "Analyse des enregistrements DNS (SPF/DMARC)...",
      scanStep4: "Recherche de vulnérabilités communes...",
      scanStep5: "Compilation des résultats...",
      scanStep6: "Génération du rapport...",
      auditCompletedMessage: "Audit terminé !"
    },
    en: {
      newAudit: "Launch a new audit",
      auditDescription: "Discover your website vulnerabilities in under 2 minutes",
      websiteUrl: "Your website URL",
      start: "Start",
      scanInProgress: "Analysis in progress...",
      auditCompleted: "Audit completed!",
      auditError: "Audit error",
      errorDescription: "An error occurred during analysis. Please try again or contact support.",
      retry: "Retry",
      newAuditButton: "New audit",
      loading: "Loading...",
      paymentConfirmed: "Payment confirmed!",
      accountCreation: "Creating your CYBAK account...",
      redirectMessage: "You will be redirected to your dashboard in a moment.",
      activationInProgress: "Activation in progress",
      activationMessage: "Your payment has been received! Your CYBAK account activation may take a few minutes.\n\nIf you have been charged, your access will be activated automatically.",
      accessDashboard: "Access dashboard",
      subscriptionInactive: "Your subscription is no longer active.",
      subscriptionPrompt: "To launch new audits and access all features, please reactivate your subscription.",
      benefits: "✅ Unlimited audits\n✅ Detailed PDF reports\n✅ Priority support",
      continuePayment: "Continue to secure payment page?",
      authError: "An error occurred. Please log in first or try again.",
      scanStep1: "Analyzing HTTPS configuration...",
      scanStep2: "Checking security headers...",
      scanStep3: "Analyzing DNS records (SPF/DMARC)...",
      scanStep4: "Searching for common vulnerabilities...",
      scanStep5: "Compiling results...",
      scanStep6: "Generating report...",
      auditCompletedMessage: "Audit completed!"
    }
  };

  const t = translations[language] || translations.en; // Changed default translation to 'en'

  // Renamed from startAudit to startAuditScan, now only handles the actual scanning logic
  const startAuditScan = useCallback(async (urlToAudit) => {
    if (!urlToAudit) return; // Should already be validated by handleStartAuditClick

    setScanStatus("scanning");
    setScanProgress(0);
    setWebsiteUrl(urlToAudit);
    
    let createdAudit = null; // Declare createdAudit here
    try {
      createdAudit = await Audit.create({
        website_url: urlToAudit,
        status: "scanning"
      });
      
      setCurrentAudit(createdAudit);
      
      const steps = [
        t.scanStep1,
        t.scanStep2,
        t.scanStep3,
        t.scanStep4,
        t.scanStep5,
        t.scanStep6
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setScanProgress(((i + 1) / steps.length) * 90);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const { data: analysisResult, error } = await performRealAudit({ websiteUrl: urlToAudit });

      if (error) {
          throw new Error(error?.data?.error || "L'audit réel a échoué.");
      }

      const updatedAudit = await Audit.update(createdAudit.id, {
        ...analysisResult,
        status: "completed",
        completed_at: new Date().toISOString()
      });

      setCurrentAudit(updatedAudit);
      setScanProgress(100);
      setScanStatus("completed");
      setCurrentStep(t.auditCompletedMessage); // Translated step here

    } catch (error) {
      console.error("Audit failed:", error);
      setScanStatus("error");
      if (createdAudit) { // Use createdAudit here
        await Audit.update(createdAudit.id, { status: "failed" });
      }
    }
  }, [t]); // Added t to dependency array as it's used inside

  const handleStartAuditClick = useCallback(async (urlToAudit) => {
    if (!urlToAudit) return;

    // Add https:// prefix if missing
    if (!urlToAudit.startsWith('http://') && !urlToAudit.startsWith('https://')) {
      urlToAudit = 'https://' + urlToAudit;
    }

    try {
      // Check user's subscription status
      const user = await User.me();
      
      if (user.subscription_status === 'active') {
        // If subscription is active, proceed with the audit scan
        startAuditScan(urlToAudit);
      } else {
        // If not active, initiate payment flow
        setIsProcessingPayment(true);
        // Sauvegarder que l'utilisateur a tenté de lancer un audit depuis la page d'accueil
        localStorage.setItem('cybak_from_homepage', 'true');
        
        // Message d'information plus chaleureux
        const confirmPayment = window.confirm(
          `🔒 ${t.subscriptionInactive}\n\n` +
          `${t.subscriptionPrompt}\n\n` +
          `${t.benefits}\n\n` +
          `${t.continuePayment}`
        );
        
        if (confirmPayment) {
          // Construire et rediriger vers le lien de paiement Stripe
          const paymentLink = `https://buy.stripe.com/6oU6oH6Y4702g0b5uegMw09?prefilled_email=${encodeURIComponent(user.email)}`;
          window.location.href = paymentLink;
        } else {
          setIsProcessingPayment(false);
        }
      }
    } catch (error) {
      console.error("Erreur au démarrage de l'audit:", error);
      setIsProcessingPayment(false); // Reset processing state on error
      alert(`⚠️ ${t.authError}`);
    }
  }, [startAuditScan, t]); // Added t to dependency array as it's used inside

  useEffect(() => {
    const checkAuthAndPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const fromHomepage = localStorage.getItem('cybak_from_homepage');
      
      try {
        await User.me();
        // L'utilisateur est connecté
        
        if (sessionId && fromHomepage) {
          // L'utilisateur revient après paiement
          setPaymentVerificationStatus('verifying');
          setIsLoading(false); // On arrête le chargement principal pour afficher la vérification

          // Logique de polling pour vérifier le statut du paiement
          for (let i = 0; i < 15; i++) { // On essaie pendant 30 secondes (15 * 2s)
            try {
              const { data } = await checkPaymentStatus({ sessionId });
              if (data.status === 'success') {
                setPaymentVerificationStatus('success');
                localStorage.removeItem('cybak_from_homepage');
                // Rediriger vers le dashboard pour qu'il puisse lancer son premier audit
                setTimeout(() => {
                  navigate(createPageUrl('Dashboard'));
                }, 2000);
                return; // On sort de la boucle et de l'effet
              }
              // Si le statut est "pending", on attend 2 secondes avant le prochain essai
              await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (pollError) {
              console.error("Erreur de vérification:", pollError);
              await new Promise(resolve => setTimeout(resolve, 2000)); // On attend même en cas d'erreur réseau
            }
          }
          // Si la boucle se termine sans succès, c'est un échec
          setPaymentVerificationStatus('error');
          localStorage.removeItem('cybak_from_homepage');
        }
        else {
          // Accès normal à la page d'audit (utilisateur déjà connecté)
          setIsLoading(false);
        }
      } catch (error) {
        // L'utilisateur n'est pas connecté
        if (sessionId) {
          // Vient de payer, on le force à se connecter/créer un compte
          User.loginWithRedirect(window.location.href);
        } else {
          // Accès direct à la page sans être connecté -> redirection vers la page d'accueil
          navigate(createPageUrl('Index'));
        }
      }
    };

    checkAuthAndPayment();
  }, [navigate, startAuditScan]);

  const resetAudit = () => {
    setCurrentAudit(null);
    setScanStatus("idle");
    setScanProgress(0);
    setCurrentStep("");
    setWebsiteUrl("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (paymentVerificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white max-w-lg mx-auto p-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-4">🎉 {t.paymentConfirmed}</h2>
          <p className="text-slate-300 mb-2">{t.accountCreation}</p>
          <p className="text-slate-400 text-sm">{t.redirectMessage}</p>
        </div>
      </div>
    );
  }

  if (paymentVerificationStatus === 'error') {
     return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white max-w-lg mx-auto p-4">
           <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">⏳ {t.activationInProgress}</h2>
          <p className="text-slate-300 mb-6">
            {t.activationMessage}
          </p>
          <Button onClick={() => navigate(createPageUrl('Dashboard'))} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            {t.accessDashboard}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              size="icon"
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          {scanStatus === "completed" && (
            <Button
              onClick={resetAudit}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
            >
              {t.newAuditButton}
            </Button>
          )}
        </div>

        {scanStatus === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cybak-glow">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">
                  {t.newAudit}
                </CardTitle>
                <p className="text-slate-300">
                  {t.auditDescription}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-white font-semibold">
                    {t.websiteUrl}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleStartAuditClick(websiteUrl)}
                    />
                    <Button
                      onClick={() => handleStartAuditClick(websiteUrl)}
                      disabled={!websiteUrl || isProcessingPayment}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow px-8"
                    >
                      {isProcessingPayment ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Play className="w-4 h-4 mr-2" />{t.start}</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {scanStatus === "scanning" && (
          <ScanningAnimation 
            progress={scanProgress}
            currentStep={currentStep}
            websiteUrl={websiteUrl}
          />
        )}

        {scanStatus === "completed" && currentAudit && (
          <ResultsDisplay 
            audit={currentAudit}
            onNewAudit={resetAudit}
          />
        )}

        {scanStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-red-900/20 border-red-500/30 max-w-2xl mx-auto">
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {t.auditError}
                </h3>
                <p className="text-slate-300 mb-6">
                  {t.errorDescription}
                </p>
                <Button
                  onClick={resetAudit}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {t.retry}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
