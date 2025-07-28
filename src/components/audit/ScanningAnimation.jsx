import React, { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Shield, Zap, Eye, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { LanguageContext } from "@/components/LanguageContext";

export default function ScanningAnimation({ progress, currentStep, websiteUrl }) {
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    fr: {
      analysisInProgress: "Analyse en cours...",
      scanning: "Scanning",
      testsCompleted: "Tests terminés",
      inProgress: "En cours",
      pending: "En attente",
      secureScan: "Scan sécurisé",
      owaspCompliant: "Conforme OWASP",
      ethicalTests: "Tests éthiques",
      scanTests: [
        { name: "SSL/TLS Security", icon: Lock },
        { name: "SQL Injection", icon: AlertTriangle },
        { name: "XSS Detection", icon: Eye },
        { name: "Security Headers", icon: Shield },
        { name: "OWASP Top 10", icon: Zap },
        { name: "Vulnerability Scan", icon: AlertTriangle }
      ]
    },
    en: {
      analysisInProgress: "Analysis in progress...",
      scanning: "Scanning",
      testsCompleted: "Tests completed",
      inProgress: "In progress",
      pending: "Pending",
      secureScan: "Secure scan",
      owaspCompliant: "OWASP compliant",
      ethicalTests: "Ethical tests",
      scanTests: [
        { name: "SSL/TLS Security", icon: Lock },
        { name: "SQL Injection", icon: AlertTriangle },
        { name: "XSS Detection", icon: Eye },
        { name: "Security Headers", icon: Shield },
        { name: "OWASP Top 10", icon: Zap },
        { name: "Vulnerability Scan", icon: AlertTriangle }
      ]
    }
  };

  const t = translations[language] || translations.fr;
  const scanTests = t.scanTests.map((test, index) => ({
    ...test,
    status: progress > 10 + (index * 15) ? "completed" : progress > 5 + (index * 15) ? "scanning" : "pending"
  }));

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "scanning":
        return <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Scanning Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cybak-glow animate-pulse">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 w-24 h-24 mx-auto border-4 border-cyan-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {t.analysisInProgress}
              </h2>
              <p className="text-slate-300 mb-4">
                {t.scanning} {websiteUrl}
              </p>
              
              {/* Progress Bar */}
              <div className="space-y-3">
                <Progress 
                  value={progress} 
                  className="h-3 bg-slate-700"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400 font-semibold">
                    {currentStep}
                  </span>
                  <span className="text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Scan Tests Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {scanTests.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                    test.status === "completed" ? "bg-green-500/10 border border-green-500/20" :
                    test.status === "scanning" ? "bg-cyan-500/10 border border-cyan-500/20" :
                    "bg-slate-700/30"
                  }`}
                >
                  <test.icon className={`w-6 h-6 ${
                    test.status === "completed" ? "text-green-400" :
                    test.status === "scanning" ? "text-cyan-400" :
                    "text-slate-500"
                  }`} />
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      test.status === "completed" ? "text-green-400" :
                      test.status === "scanning" ? "text-cyan-400" :
                      "text-slate-400"
                    }`}>
                      {test.name}
                    </div>
                  </div>
                  
                  {getStatusIcon(test.status)}
                </motion.div>
              ))}
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {Math.floor(progress / 10)}
                </div>
                <div className="text-slate-400 text-sm">{t.testsCompleted}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {progress < 90 ? Math.floor(Math.random() * 3) + 1 : 0}
                </div>
                <div className="text-slate-400 text-sm">{t.inProgress}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400 mb-1">
                  {10 - Math.floor(progress / 10)}
                </div>
                <div className="text-slate-400 text-sm">{t.pending}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">{t.secureScan}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">{t.owaspCompliant}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">{t.ethicalTests}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}