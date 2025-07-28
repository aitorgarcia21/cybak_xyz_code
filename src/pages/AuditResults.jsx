
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { auth, db } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Shield, 
  TrendingUp,
  Eye,
  Lock,
  Globe,
  FileText,
  ArrowRight,
  ExternalLink,
  FileCode,
  List,
  Server
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/LanguageContext";

export default function AuditResults() {
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    fr: {
      auditResults: "Résultats d'audit",
      downloadPDF: "Télécharger PDF",
      securityScore: "Score de sécurité",
      critical: "Critiques",
      major: "Majeures", 
      minor: "Mineures",
      sslGrade: "Grade SSL/TLS",
      pdfReport: "Rapport PDF",
      serverConfigAnalysis: "Analyse de Configuration Serveur",
      exposedSensitiveFiles: "Fichiers sensibles exposés",
      directoryListing: "Listage de répertoire",
      commonWebPorts: "Ports Web Communs",
      detectedVulnerabilities: "Vulnérabilités détectées",
      securityHeaders: "Headers de sécurité",
      priorityRecommendations: "Recommandations prioritaires",
      nextSteps: "Prochaines étapes",
      nextStepsDescription: "Votre audit est terminé ! Téléchargez votre rapport détaillé et considérez un monitoring continu pour rester protégé.",
      downloadFullReport: "Télécharger le rapport complet",
      newAudit: "Nouvel audit",
      loading: "Chargement des résultats...",
      auditNotFound: "Audit non trouvé ou accès non autorisé",
      backToDashboard: "Retour au tableau de bord",
      recommendation: "Recommandation :",
      filesExposedDetected: "Fichiers exposés détectés:",
      noSensitiveFiles: "Aucun fichier sensible commun exposé.",
      directoryListingEnabled: "Le listage de répertoire est activé.",
      directoryListingDisabled: "Le listage de répertoire est désactivé.",
      openPortsDetected: "Ports ouverts détectés :",
      portScanInconclusive: "Scan des ports non concluant."
    },
    en: {
      auditResults: "Audit Results",
      downloadPDF: "Download PDF",
      securityScore: "Security Score",
      critical: "Critical",
      major: "Major",
      minor: "Minor", 
      sslGrade: "SSL/TLS Grade",
      pdfReport: "PDF Report",
      serverConfigAnalysis: "Server Configuration Analysis",
      exposedSensitiveFiles: "Exposed sensitive files",
      directoryListing: "Directory listing",
      commonWebPorts: "Common Web Ports",
      detectedVulnerabilities: "Detected vulnerabilities",
      securityHeaders: "Security headers",
      priorityRecommendations: "Priority recommendations",
      nextSteps: "Next steps",
      nextStepsDescription: "Your audit is complete! Download your detailed report and consider continuous monitoring to stay protected.",
      downloadFullReport: "Download full report",
      newAudit: "New audit",
      loading: "Loading results...",
      auditNotFound: "Audit not found or unauthorized access",
      backToDashboard: "Back to dashboard",
      recommendation: "Recommendation:",
      filesExposedDetected: "Exposed files detected:",
      noSensitiveFiles: "No common sensitive files exposed.",
      directoryListingEnabled: "Directory listing is enabled.",
      directoryListingDisabled: "Directory listing is disabled.",
      openPortsDetected: "Open ports detected:",
      portScanInconclusive: "Port scan inconclusive."
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    const loadAuditResults = async () => {
      setIsLoading(true);
      try {
        // Sécurisation : 1. Vérifier que l'utilisateur est connecté
        const { user: currentUser } = await auth.getCurrentUser();
        if (!currentUser) throw new Error('Not authenticated');
        
        const urlParams = new URLSearchParams(window.location.search);
        const auditId = urlParams.get('id');
        
        if (auditId) {
          // Sécurisation : 2. Vérifier que l'audit demandé appartient bien à l'utilisateur connecté
          const { data: auditList } = await db.audits.getByUserId(currentUser.id);
          const foundAudit = auditList?.find(a => a.id === auditId);
          if (foundAudit) {
            setAudit(foundAudit);
          } else {
            // Si l'audit n'est pas trouvé ou n'appartient pas à l'utilisateur, redirection
            navigate(createPageUrl('Dashboard'));
          }
        } else {
          navigate(createPageUrl('Dashboard'));
        }
      } catch (error) {
        // Si non connecté, redirection
        navigate('/');
      }
      setIsLoading(false);
    };

    loadAuditResults();
  }, [navigate]);

  const downloadPDF = () => {
    // Simulate PDF download
    const element = document.createElement("a");
    const file = new Blob([generatePDFContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cybak-audit-${audit.website_url.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generatePDFContent = () => {
    if (!audit) return "";
    return `
CYBAK - RAPPORT D'AUDIT DE SÉCURITÉ
====================================

Site web analysé: ${audit.website_url}
Date d'analyse: ${format(new Date(audit.created_date), "dd/MM/yyyy à HH:mm")}
Score de sécurité: ${audit.security_score}/100

RÉSUMÉ EXÉCUTIF
===============
Issues critiques: ${audit.critical_issues || 0}
Issues majeures: ${audit.major_issues || 0}  
Issues mineures: ${audit.minor_issues || 0}

DÉTAILS DES VULNÉRABILITÉS
==========================
${audit.scan_details?.vulnerabilities?.map((vuln, i) => `
${i + 1}. ${vuln.type} (${vuln.severity})
   Description: ${vuln.description}
   Recommandation: ${vuln.recommendation}
`).join('') || 'Aucune vulnérabilité détaillée disponible.'}

ANALYSE DE CONFIGURATION SERVEUR
================================
Fichiers sensibles exposés: ${audit.scan_details?.exposed_files && audit.scan_details.exposed_files.length > 0 ? audit.scan_details.exposed_files.join(', ') : 'Aucun fichier sensible commun exposé.'}
Listage de répertoire: ${audit.scan_details?.directory_listing ? 'Activé' : 'Désactivé'}
Ports ouverts détectés: ${audit.scan_details?.open_ports && audit.scan_details.open_ports.length > 0 ? audit.scan_details.open_ports.join(', ') : 'Scan des ports non concluant.'}

RECOMMANDATIONS PRIORITAIRES
============================
${audit.scan_details?.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n') || 'Aucune recommandation spécifique.'}

Headers de sécurité détectés:
${audit.scan_details?.security_headers?.join(', ') || 'Non analysés'}

Grade SSL/TLS: ${audit.scan_details?.ssl_grade || 'Non évalué'}

---
Rapport généré par CYBAK - Expert en cybersécurité
Pour plus d'informations: https://cybak.fr
    `;
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "high":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t.auditNotFound}</h1>
          <Button onClick={() => navigate(createPageUrl('Dashboard'))}>
            {t.backToDashboard}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              size="icon"
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{t.auditResults}</h1>
              <p className="text-slate-300 mt-1">
                {audit.website_url} • {format(new Date(audit.created_date), "dd MMMM yyyy à HH:mm")}
              </p>
            </div>
          </div>
          
          <Button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadPDF}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Results Header */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Security Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - (audit.security_score || 0) / 100)}`}
                        className={getScoreColor(audit.security_score || 0)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-3xl font-bold ${getScoreColor(audit.security_score || 0)}`}>
                        {audit.security_score || 0}
                      </div>
                      <div className="text-slate-400 text-sm">/ 100</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-4xl font-bold ${getScoreColor(audit.security_score || 0)}`}>
                      Grade {getScoreGrade(audit.security_score || 0)}
                    </div>
                    <div className="text-slate-300">{t.securityScore}</div>
                  </div>
                </div>

                {/* Issue Breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {audit.critical_issues || 0}
                    </div>
                    <div className="text-slate-300 text-sm">{t.critical}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {audit.major_issues || 0}
                    </div>
                    <div className="text-slate-300 text-sm">{t.major}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {audit.minor_issues || 0}
                    </div>
                    <div className="text-slate-300 text-sm">{t.minor}</div>
                  </div>
                </div>

                {/* SSL Grade & Info */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {audit.scan_details?.ssl_grade || "A+"}
                    </div>
                    <div className="text-slate-300 text-sm">{t.sslGrade}</div>
                  </div>
                  
                  <Button
                    onClick={downloadPDF}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t.pdfReport}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NEW: Server Configuration Analysis */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="w-5 h-5 mr-2 text-purple-400" />
                {t.serverConfigAnalysis}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exposed Files */}
              <div>
                <div className="flex items-center mb-2">
                  <FileCode className="w-5 h-5 mr-2 text-slate-400" />
                  <h4 className="text-white font-semibold">{t.exposedSensitiveFiles}</h4>
                </div>
                {audit.scan_details?.exposed_files && audit.scan_details.exposed_files.length > 0 ? (
                  <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">
                      {t.filesExposedDetected} {audit.scan_details.exposed_files.join(', ')}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">{t.noSensitiveFiles}</span>
                  </div>
                )}
              </div>
              
              {/* Directory Listing */}
              <div>
                <div className="flex items-center mb-2">
                  <List className="w-5 h-5 mr-2 text-slate-400" />
                  <h4 className="text-white font-semibold">{t.directoryListing}</h4>
                </div>
                {audit.scan_details?.directory_listing ? (
                  <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">{t.directoryListingEnabled}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">{t.directoryListingDisabled}</span>
                  </div>
                )}
              </div>
              
               {/* Open Ports */}
              <div>
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 mr-2 text-slate-400" />
                  <h4 className="text-white font-semibold">{t.commonWebPorts}</h4>
                </div>
                {audit.scan_details?.open_ports && audit.scan_details.open_ports.length > 0 ? (
                  <div className="flex items-center space-x-3 p-3 bg-blue-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300">{t.openPortsDetected} {audit.scan_details.open_ports.join(', ')}</span>
                  </div>
                ) : (
                   <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-slate-400">{t.portScanInconclusive}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          {/* Vulnerabilities Details */}
          {audit.scan_details?.vulnerabilities && audit.scan_details.vulnerabilities.length > 0 && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  {t.detectedVulnerabilities} ({audit.scan_details.vulnerabilities.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audit.scan_details.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold">{vuln.type}</h4>
                          <Badge className={`${getSeverityColor(vuln.severity)} border`}>
                            {vuln.severity}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{vuln.description}</p>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-cyan-400 text-sm font-semibold mb-1">{t.recommendation}</div>
                          <p className="text-slate-400 text-sm">{vuln.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security Headers Analysis */}
          {audit.scan_details?.security_headers && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-400" />
                  {t.securityHeaders} ({audit.scan_details.security_headers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {audit.scan_details.security_headers.map((header, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-900/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">{header}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {audit.scan_details?.recommendations && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  {t.priorityRecommendations} ({audit.scan_details.recommendations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {audit.scan_details.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-slate-900/30 rounded-lg">
                      <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-slate-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps CTA */}
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 cybak-border-glow">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t.nextSteps}
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                {t.nextStepsDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={downloadPDF}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t.downloadFullReport}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400"
                  onClick={() => navigate(createPageUrl('Audit'))}
                >
                  {t.newAudit}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
