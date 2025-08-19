import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Scan, FileText, TrendingUp, Lock, Zap, ChevronDown, Info, AlertCircle, CheckCircle2 } from "lucide-react";

export default function FeaturesSection() {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [showTechnical, setShowTechnical] = useState(false);

  const features = [
    {
      icon: Scan,
      title: "Analyse Intelligente",
      simpleDesc: "Votre site est scanné automatiquement pour détecter les failles",
      techDesc: "Moteur d'analyse basé sur OWASP ZAP, Nuclei et patterns CVE. Détection par IA des vulnérabilités zero-day.",
      color: "from-blue-500 to-cyan-500",
      details: [
        "Scan de ports et services",
        "Analyse des dépendances npm/pip",
        "Détection de backdoors",
        "Fuzzing intelligent"
      ]
    },
    {
      icon: Shield,
      title: "Protection Continue",
      simpleDesc: "Surveillance 24/7 de votre site avec alertes instantanées",
      techDesc: "Monitoring actif avec webhooks, intégration SIEM, et corrélation d'événements en temps réel.",
      color: "from-purple-500 to-pink-500",
      details: [
        "WAF virtuel intégré",
        "Détection d'intrusion (IDS)",
        "Analyse comportementale",
        "Threat intelligence feeds"
      ]
    },
    {
      icon: FileText,
      title: "Rapports Détaillés",
      simpleDesc: "Rapport clair avec solutions concrètes pour chaque problème",
      techDesc: "Export PDF/JSON avec mapping CVE, CVSS scoring, et intégration Jira/GitHub pour DevSecOps.",
      color: "from-green-500 to-emerald-500",
      details: [
        "Priorisation par criticité",
        "Code snippets de correction",
        "Timeline de remédiation",
        "Comparaison avant/après"
      ]
    },
    {
      icon: TrendingUp,
      title: "Analyse de Risques",
      simpleDesc: "Suivez l'évolution de la sécurité de votre site",
      techDesc: "Dashboards KPI/KRI, calcul de risque résiduel, et modélisation des menaces STRIDE/DREAD.",
      color: "from-orange-500 to-red-500",
      details: [
        "Score de sécurité global",
        "Tendances mensuelles",
        "Benchmarking sectoriel",
        "Prédiction ML des risques"
      ]
    },
    {
      icon: Lock,
      title: "Conformité",
      simpleDesc: "Respectez automatiquement les normes de sécurité",
      techDesc: "Validation GDPR, PCI-DSS, ISO 27001, SOC2. Génération automatique de preuves d'audit.",
      color: "from-indigo-500 to-purple-500",
      details: [
        "Checklist de conformité",
        "Audit trail complet",
        "Templates de politique",
        "Certification ready"
      ]
    },
    {
      icon: Zap,
      title: "Ultra Rapide",
      simpleDesc: "Résultats en quelques minutes seulement",
      techDesc: "Architecture distribuée, scan parallélisé, cache intelligent. API rate: 10k req/sec.",
      color: "from-yellow-500 to-orange-500",
      details: [
        "Scan incrémental",
        "Priorisation intelligente",
        "Mode turbo disponible",
        "SLA 99.99% uptime"
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
              Tout ce dont vous avez besoin
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Pour une sécurité complète
              </span>
            </h2>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Des outils de sécurité professionnels, accessibles à tous
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
