import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Zap, ArrowRight, Shield, CreditCard, Lock, Globe, Eye, AlertTriangle, FileCode, List, Server } from "lucide-react";
import { LanguageContext } from "@/components/LanguageContext";

export default function PricingSection({ onStart }) {
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    fr: {
      title: "Un tarif unique et transparent",
      subtitle: "Profitez d'un accès illimité à tous nos outils d'analyse pour un prix mensuel fixe.",
      planName: "Accès Premium",
      planDesc: "Pour des analyses avancées et un monitoring continu de votre sécurité.",
      features: [
        "Audits illimités",
        "Rapports PDF détaillés",
        "Support prioritaire",
        "Dashboard avancé"
      ],
      scansPerformed: "Scans de sécurité réalisés :",
      scansList: [
        "Vérification HTTPS/SSL",
        "En-têtes de sécurité HTTP",
        "Détection contenu mixte",
        "Identification CMS vulnérables",
        "Fichiers sensibles exposés",
        "Directory listing",
        "Scan ports web communs",
        "Adresses e-mail exposées"
      ],
      ctaButton: "S'abonner - 4,99€/mois"
    },
    en: {
      title: "Simple, Transparent Pricing for US Businesses",
      subtitle: "Unlimited security audits and comprehensive vulnerability detection for a fixed monthly price. No hidden fees, cancel anytime.",
      planName: "Premium Security Suite",
      planDesc: "Complete website security solution with continuous monitoring and priority support for US businesses.",
      features: [
        "Unlimited security audits",
        "Detailed PDF & CSV reports",
        "24/7 priority support",
        "Advanced security dashboard",
        "Compliance reporting (ISO 27001, GDPR, CCPA)",
        "Vulnerability remediation guidance"
      ],
      scansPerformed: "Comprehensive security scans include:",
      scansList: [
        "HTTPS/SSL certificate validation",
        "HTTP security headers analysis",
        "Mixed content & insecure resource detection",
        "Vulnerable CMS & plugin identification",
        "Exposed configuration files & sensitive data",
        "Directory listing & file exposure checks",
        "Common web service port scanning",
        "Email address & personal data exposure"
      ],
      ctaButton: "Get Started - $4.99/month"
    }
  };

  const t = translations[language] || translations.fr;

  const plan = {
    name: t.planName,
    price: "4,99",
    period: language === 'fr' ? "/mois" : "/month",
    description: t.planDesc,
    icon: Shield,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/50",
    glowColor: "cybak-glow",
    features: t.features,
    scansPerformed: t.scansPerformed,
    scansList: t.scansList,
    cta: t.ctaButton,
  };

  const scanIcons = [Lock, Shield, Eye, AlertTriangle, FileCode, List, Server, Globe];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <Card className={`bg-slate-800/50 backdrop-blur-sm ${plan.borderColor} border-2 h-full relative overflow-hidden group hover:scale-105 transition-all duration-300 ${plan.glowColor}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/20"></div>
              
              <CardHeader className="text-center pb-8 relative z-10">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Shield className={`w-8 h-8 ${plan.color}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-slate-400 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${plan.color}`}>
                    {plan.price}€
                  </span>
                  <span className="text-slate-400 ml-2">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Security Scans */}
                <div className="mb-8 p-4 bg-slate-900/30 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    {plan.scansPerformed}
                  </h4>
                  <ul className="space-y-2">
                    {plan.scansList.map((scan, scanIndex) => {
                      const IconComponent = scanIcons[scanIndex] || CheckCircle;
                      return (
                        <li key={scanIndex} className="flex items-center text-sm">
                          <IconComponent className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">{scan}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Button 
                  onClick={onStart}
                  className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow font-semibold`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}