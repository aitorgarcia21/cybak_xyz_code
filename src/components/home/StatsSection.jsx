import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Clock, TrendingUp } from "lucide-react";
import { LanguageContext } from "@/components/LanguageContext";

export default function StatsSection() {
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    fr: {
      sitesSecured: "Sites sécurisés",
      detectionRate: "Taux de détection",
      analysisTime: "Temps d'analyse",
      satisfaction: "Satisfaction client",
      trustedBy: "Ils nous font confiance"
    },
    en: {
      sitesSecured: "Sites secured",
      detectionRate: "Detection rate",
      analysisTime: "Analysis time",
      satisfaction: "Client satisfaction",
      trustedBy: "They trust us"
    }
  };

  const t = translations[language] || translations.fr;

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: t.sitesSecured,
      color: "text-cyan-400"
    },
    {
      icon: Shield,
      value: "99.8%",
      label: t.detectionRate,
      color: "text-blue-400"
    },
    {
      icon: Clock,
      value: "< 60s",
      label: t.analysisTime,
      color: "text-green-400"
    },
    {
      icon: TrendingUp,
      value: "4.9/5",
      label: t.satisfaction,
      color: "text-purple-400"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 cybak-border-glow hover:cybak-glow transition-all duration-300 group-hover:scale-105">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-700 transition-all duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-slate-300 font-medium">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Client Logos */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-20"
      >
        <p className="text-center text-slate-400 mb-8">
          {t.trustedBy}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {/* Mock client logos */}
          {['Microsoft', 'Google', 'Amazon', 'Apple', 'Meta', 'Netflix'].map((company, index) => (
            <div key={index} className="bg-slate-800/30 px-6 py-3 rounded-lg">
              <span className="text-slate-400 font-semibold">{company}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}