import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Shield, Scan, FileText, TrendingUp, Lock, Zap, ChevronDown, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { LanguageContext } from "@/context/LanguageContext";

export default function FeaturesSection() {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    en: {
      title: "Everything you need",
      subtitle: "For complete security",
      description: "Professional security tools, accessible to everyone"
    },
    fr: {
      title: "Tout ce dont vous avez besoin",
      subtitle: "Pour une sécurité complète",
      description: "Des outils de sécurité professionnels, accessibles à tous"
    }
  };

  const t = translations[language] || translations.en;

  const features = [
    {
      icon: Scan,
      title: language === 'fr' ? "Analyse Intelligente" : "Smart Analysis",
      simpleDesc: language === 'fr' ? "Votre site est scanné automatiquement pour détecter les failles" : "Your site is automatically scanned to detect vulnerabilities",
      techDesc: language === 'fr' ? "Moteur d'analyse basé sur OWASP ZAP, Nuclei et patterns CVE. Détection par IA des vulnérabilités zero-day." : "Analysis engine based on OWASP ZAP, Nuclei and CVE patterns. AI detection of zero-day vulnerabilities.",
      color: "from-blue-500 to-cyan-500",
      details: language === 'fr' ? [
        "Scan de ports et services",
        "Analyse des dépendances npm/pip",
        "Détection de backdoors",
        "Fuzzing intelligent"
      ] : [
        "Port and service scanning",
        "npm/pip dependency analysis",
        "Backdoor detection",
        "Smart fuzzing"
      ]
    },
    {
      icon: FileText,
      title: language === 'fr' ? "Rapports Détaillés" : "Detailed Reports",
      simpleDesc: language === 'fr' ? "Rapport clair avec solutions concrètes pour chaque problème" : "Clear report with concrete solutions for each issue",
      techDesc: language === 'fr' ? "Export PDF/JSON avec mapping CVE, CVSS scoring, et intégration Jira/GitHub pour DevSecOps." : "PDF/JSON export with CVE mapping, CVSS scoring, and Jira/GitHub integration for DevSecOps.",
      color: "from-green-500 to-emerald-500",
      details: language === 'fr' ? [
        "Priorisation par criticité",
        "Solutions étape par étape",
        "Code d'exemple pour corrections",
        "Timeline de remédiation"
      ] : [
        "Priority by criticality",
        "Step-by-step solutions",
        "Example code for fixes",
        "Remediation timeline"
      ]
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? "Amélioration Continue" : "Continuous Improvement",
      simpleDesc: language === 'fr' ? "Suivi de vos progrès et recommandations personnalisées" : "Track your progress and get personalized recommendations",
      techDesc: language === 'fr' ? "Tableau de bord avec métriques de sécurité, trending analysis, et benchmarking sectoriel." : "Dashboard with security metrics, trending analysis, and industry benchmarking.",
      color: "from-orange-500 to-red-500",
      details: language === 'fr' ? [
        "Score de sécurité évolutif",
        "Comparaison avec l'industrie",
        "Alertes proactives",
        "Roadmap sécurité"
      ] : [
        "Evolving security score",
        "Industry comparison",
        "Proactive alerts",
        "Security roadmap"
      ]
    },
    {
      icon: Lock,
      title: language === 'fr' ? "Conformité Garantie" : "Guaranteed Compliance",
      simpleDesc: language === 'fr' ? "Vérification automatique des standards de sécurité" : "Automatic verification of security standards",
      techDesc: language === 'fr' ? "Audit de conformité RGPD, SOC 2, ISO 27001, PCI DSS avec génération de rapports de certification." : "GDPR, SOC 2, ISO 27001, PCI DSS compliance audit with certification report generation.",
      color: "from-indigo-500 to-purple-500",
      details: language === 'fr' ? [
        "RGPD/GDPR compliance",
        "Standards ISO 27001",
        "Audit PCI DSS",
        "Rapports de certification"
      ] : [
        "GDPR/RGPD compliance",
        "ISO 27001 standards",
        "PCI DSS audit",
        "Certification reports"
      ]
    },
    {
      icon: Zap,
      title: language === 'fr' ? "Ultra Rapide" : "Ultra Fast",
      simpleDesc: language === 'fr' ? "Résultats en quelques minutes seulement" : "Results in just a few minutes",
      techDesc: language === 'fr' ? "Architecture distribuée, scan parallélisé, cache intelligent. API rate: 10k req/sec." : "Distributed architecture, parallelized scanning, smart caching. API rate: 10k req/sec.",
      color: "from-yellow-500 to-orange-500",
      details: language === 'fr' ? [
        "Scan en moins de 5 min",
        "Architecture cloud native",
        "Cache intelligent",
        "API haute performance"
      ] : [
        "Scan in under 5 min",
        "Cloud native architecture",
        "Smart caching",
        "High performance API"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with toggle */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {t.subtitle}
              </span>
            </h2>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              {t.description}
            </p>
            
          </motion.div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const isExpanded = expandedFeature === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 hover:border-cyan-500/50">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Description - Simple or Technical based on toggle */}
                  <p className="text-slate-400 mb-4">
                    {showTechnical ? feature.techDesc : feature.simpleDesc}
                  </p>
                  
                  {/* Expand button for details */}
                  <button
                    onClick={() => setExpandedFeature(isExpanded ? null : index)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{isExpanded ? "Masquer" : "Voir"} détails</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Expanded details */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            );
          })}
        </div>

        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-12 border border-cyan-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">
              Prêt à sécuriser votre site ?
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'entreprises qui nous font confiance pour leur sécurité
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-cyan-500/25">
              Commencer l'essai gratuit
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
