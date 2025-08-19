import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { LanguageContext } from "@/context/LanguageContext";

export default function PricingSection({ onStart }) {
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    en: {
      title: "Special Offer - Free Today Only",
      subtitle: "Take advantage of our completely free platform today. Create your account and start your security audits immediately.",
      planTitle: "Full Access",
      planSubtitle: "Free today only",
      startButton: "Get Started",
      soonButton: "Coming Soon",
      features: {
        unlimitedAudits: "Unlimited security audits",
        securityTests: "100+ security tests",
        detailedReports: "Detailed instant reports",
        emailSupport: "Email support",
        realTimeMonitoring: "Real-time monitoring",
        automatedScans: "Automated scans",
        prioritySupport: "Priority support",
        customIntegrations: "Custom integrations",
        dedicatedSupport: "Dedicated support",
        slaGuarantee: "SLA guarantee"
      },
      plans: {
        pro: "Pro",
        enterprise: "Enterprise",
        comingSoon: "Coming soon",
        custom: "Custom"
      }
    },
    fr: {
      title: "Offre Spéciale - Gratuit Aujourd'hui Seulement",
      subtitle: "Profitez de notre plateforme complètement gratuite aujourd'hui. Créez votre compte et commencez vos audits de sécurité immédiatement.",
      planTitle: "Accès Complet",
      planSubtitle: "Gratuit aujourd'hui seulement",
      startButton: "Commencer",
      soonButton: "Bientôt",
      features: {
        unlimitedAudits: "Audits de sécurité illimités",
        securityTests: "100+ tests de sécurité",
        detailedReports: "Rapports détaillés instantanés",
        emailSupport: "Support par email",
        realTimeMonitoring: "Surveillance en temps réel",
        automatedScans: "Scans automatisés",
        prioritySupport: "Support prioritaire",
        customIntegrations: "Intégrations personnalisées",
        dedicatedSupport: "Support dédié",
        slaGuarantee: "Garantie SLA"
      },
      plans: {
        pro: "Pro",
        enterprise: "Entreprise",
        comingSoon: "Bientôt disponible",
        custom: "Sur mesure"
      }
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
{t.subtitle}
          </motion.p>
        </div>

        <div className="flex justify-center">
              {/* Starter Plan - Seul plan disponible */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 w-full max-w-2xl">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-white mb-3">{t.planTitle}</h3>
                  <p className="text-slate-400 text-lg mb-6">{t.planSubtitle}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-slate-500 line-through mr-4">$29</span>
                    <span className="text-6xl font-bold text-green-400">{language === 'fr' ? 'Gratuit' : 'Free'}</span>
                  </div>
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 text-lg transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={onStart}
                  >
                    {t.startButton}
                  </Button>
                </div>
                <ul className="grid grid-cols-2 gap-4 text-left">
                  <li className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-base font-medium">{t.features.unlimitedAudits}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-base font-medium">{t.features.securityTests}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-base font-medium">{t.features.detailedReports}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-base font-medium">{t.features.emailSupport}</span>
                  </li>
                </ul>
              </div>
        </div>
      </div>
    </div>
  );
}