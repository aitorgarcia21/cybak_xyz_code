
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Eye, 
  Download, 
  Shield, 
  Brain, 
  Clock,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  FileText
} from "lucide-react";
import { LanguageContext } from "@/components/LanguageContext";

export default function FeaturesSection() {
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    fr: {
      howItWorks: "Comment ça marche ?",
      subtitle: "3 étapes simples pour sécuriser votre site web",
      step1Title: "Saisissez votre URL",
      step1Desc: "Entrez simplement l'adresse de votre site web",
      step2Title: "Analyse instantanée",
      step2Desc: "Notre IA scanne plus de 100 points de vulnérabilité",
      step3Title: "Rapport interactif",
      step3Desc: "Recevez votre rapport détaillé avec plan d'action"
    },
    en: {
      howItWorks: "How it works?",
      subtitle: "3 simple steps to secure your website",
      step1Title: "Enter your URL",
      step1Desc: "Simply enter your website address",
      step2Title: "Instant analysis",
      step2Desc: "Our AI scans over 100 vulnerability points",
      step3Title: "Interactive report",
      step3Desc: "Receive your detailed report with action plan"
    }
  };

  const t = translations[language] || translations.fr;

  const processSteps = [
    {
      step: "01",
      title: t.step1Title,
      description: t.step1Desc,
      icon: Globe
    },
    {
      step: "02", 
      title: t.step2Title,
      description: t.step2Desc,
      icon: Brain
    },
    {
      step: "03",
      title: t.step3Title,
      description: t.step3Desc,
      icon: FileText
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Process Steps */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {t.howItWorks}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-300"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative text-center group"
            >
              {/* Connecting Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent transform -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center cybak-border-glow group-hover:cybak-glow transition-all duration-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">{step.step}</div>
                    <step.icon className="w-8 h-8 text-cyan-400 mx-auto" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-300">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
