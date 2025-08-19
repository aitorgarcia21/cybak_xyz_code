import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Lock, Activity, Globe2, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ onStart }) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 animate-gradient-shift"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)`
        }}></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23334155' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading - Dual messaging */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-white">Sécurisez votre site web</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              En quelques clics
            </span>
          </motion.h1>

          {/* Dual messaging - Simple for everyone, technical for pros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-3xl mx-auto"
          >
            <p className="text-xl text-slate-300 mb-4 leading-relaxed">
              <span className="font-semibold text-white">Pour tous :</span> Découvrez si votre site est sécurisé avec un simple scan. 
              Obtenez un rapport clair avec des recommandations faciles à suivre.
            </p>
            
            {/* Toggle for technical details */}
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showTechnical ? "Masquer les détails techniques" : "Voir les détails techniques pour les pros"}
              </span>
            </button>
            
            {/* Technical details for professionals */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showTechnical ? 1 : 0, 
                height: showTechnical ? "auto" : 0 
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mt-4">
                <p className="text-sm text-slate-400 mb-3">
                  <span className="font-semibold text-cyan-400">Pour les professionnels :</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-slate-300">Scan OWASP Top 10 + CWE/SANS Top 25</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-slate-300">Analyse des headers HTTP (HSTS, CSP, X-Frame)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-slate-300">Détection XSS, SQLi, CSRF, XXE</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-slate-300">API REST/GraphQL security testing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-slate-300">SSL/TLS configuration audit</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-slate-300">Export JSON/PDF avec CVE mapping</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Buttons - Clear and inviting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 group"
            >
              Tester Gratuitement
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-cyan-500/50 px-8 py-6 text-lg font-medium rounded-xl transition-all duration-300"
            >
              Voir une Démo
            </Button>
          </motion.div>


          {/* Simple explanation for non-technical users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 max-w-2xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Pourquoi scanner votre site ?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-medium text-white">93% des sites web</span> ont au moins une vulnérabilité critique.
                Un simple scan peut révéler des failles que les hackers exploitent quotidiennement.
                <span className="block mt-2 text-cyan-400">Protégez vos données et celles de vos clients dès maintenant.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle animated elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-slate-500">
          <ArrowRight className="w-6 h-6 rotate-90" />
        </div>
      </motion.div>
    </div>
  );
}
