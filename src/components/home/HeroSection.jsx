
import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Play, ArrowRight, Globe, Lock, CheckCircle, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/LanguageContext";

export default function HeroSection({ onStart }) {
  const [typedText, setTypedText] = useState("");
  const { language } = useContext(LanguageContext) || { language: 'fr' };
  
  const translations = {
    fr: {
      secureYourWebsite: "Sécurisez votre",
      website: " site web",
      description: "Détectez les failles de sécurité en moins de 2 minutes avec notre scanner alimenté par IA. Plus de 100 tests automatisés pour une protection maximale.",
      sitesSecured: "Plus de 10 000 sites sécurisés",
      ctaButton: "S'abonner - 4,99€/mois pour des audits illimités",
      ctaButtonShort: "S'abonner - 4,99€/mois",
      ctaSubtext: "Connexion sécurisée puis paiement",
      cancelAnytime: "Annulable à tout moment",
      isoCompliant: "Conforme ISO 27001",
      pciProcess: "Processus PCI-DSS",
      gdprCompliant: "RGPD"
    },
    en: {
      secureYourWebsite: "Secure your",
      website: " website",
      description: "Detect security vulnerabilities in under 2 minutes with our AI-powered scanner. Over 100 automated tests for maximum protection.",
      sitesSecured: "Over 10,000 sites secured",
      ctaButton: "Subscribe - €4.99/month for unlimited audits",
      ctaButtonShort: "Subscribe - €4.99/month",
      ctaSubtext: "Secure login then payment",
      cancelAnytime: "Cancel anytime",
      isoCompliant: "ISO 27001 Compliant",
      pciProcess: "PCI-DSS Process",
      gdprCompliant: "GDPR"
    }
  };

  const currentTranslations = translations[language];
  const fullText = currentTranslations.sitesSecured;

  useEffect(() => {
    setTypedText("");
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [fullText]);

  return (
    <div className="pt-20"> {/* Changed: Removed 'relative' and 'overflow-hidden' from this div */}
      {/* Animated Background */}
      <div className="absolute inset-0"> {/* This div will now position relative to the viewport or nearest positioned ancestor */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="border-r border-cyan-500/20 animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                {currentTranslations.secureYourWebsite}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 cybak-text-glow">
                  {currentTranslations.website}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                {currentTranslations.description}
              </p>

              <div className="flex items-center justify-center space-x-2 text-cyan-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-lg font-medium">{typedText}</span>
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 cybak-border-glow max-w-2xl mx-auto">
              <Button 
                onClick={onStart}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow h-12 sm:h-14 px-4 sm:px-10 text-sm sm:text-lg font-semibold w-full"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="hidden sm:inline">{currentTranslations.ctaButton}</span>
                <span className="sm:hidden">{currentTranslations.ctaButtonShort}</span>
              </Button>
              
              <p className="text-slate-400 text-sm mt-3 text-center">
                {currentTranslations.ctaSubtext}
              </p>
              
              <div className="flex items-center justify-center mt-3 text-green-400 text-sm">
                <Lock className="w-4 h-4 mr-2" />
                {currentTranslations.cancelAnytime}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-slate-300 text-sm">{currentTranslations.isoCompliant}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{currentTranslations.pciProcess}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-slate-300 text-sm">{currentTranslations.gdprCompliant}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
