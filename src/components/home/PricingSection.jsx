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
    <div className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{t.planTitle}</h3>
                  <p className="text-slate-400 text-sm">{t.planSubtitle}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white line-through text-slate-500">$29</span>
                    <span className="text-4xl font-bold text-green-400 ml-2">Gratuit</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 mb-8"
                  onClick={onStart}
                >
                  {t.startButton}
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{t.features.unlimitedAudits}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{t.features.securityTests}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{t.features.detailedReports}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{t.features.emailSupport}</span>
                  </li>
                </ul>
              </div>

              {/* Bientôt Disponible */}
              <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 opacity-60">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">{t.plans.pro}</h3>
                  <p className="text-slate-500 text-sm">{t.plans.comingSoon}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-slate-500">$49</span>
                    <span className="text-slate-500">/mois</span>
                  </div>
                </div>
                <Button 
                  disabled
                  variant="outline"
                  className="w-full border-slate-700 text-slate-500 cursor-not-allowed mb-8"
                >
                  {t.soonButton}
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-sm">{t.features.realTimeMonitoring}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-sm">{t.features.automatedScans}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-sm">{t.features.prioritySupport}</span>
                  </li>
                </ul>
              </div>

              {/* Enterprise */}
              <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 opacity-60">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">{t.plans.enterprise}</h3>
                  <p className="text-slate-500 text-sm">{t.plans.comingSoon}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-slate-500">{t.plans.custom}</span>
                  </div>
                </div>
                <Button 
                  disabled
                  variant="outline"
                  className="w-full border-slate-700 text-slate-500 cursor-not-allowed mb-8"
                >
                  {t.soonButton}
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-sm">{t.features.customIntegrations}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-sm">{t.features.dedicatedSupport}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-sm">{t.features.slaGuarantee}</span>
                  </li>
                </ul>
              </div>
        </div>
      </div>
    </div>
  );
}