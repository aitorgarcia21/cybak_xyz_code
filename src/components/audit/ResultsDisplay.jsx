import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
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
  ArrowRight
} from "lucide-react";

export default function ResultsDisplay({ audit, onNewAudit }) {
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

  return (
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
                <div className="text-slate-300">Score de sécurité</div>
              </div>
            </div>

            {/* Issue Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {audit.critical_issues || 0}
                </div>
                <div className="text-slate-300 text-sm">Critiques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {audit.major_issues || 0}
                </div>
                <div className="text-slate-300 text-sm">Majeures</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {audit.minor_issues || 0}
                </div>
                <div className="text-slate-300 text-sm">Mineures</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow">
                <Download className="w-4 h-4 mr-2" />
                Télécharger le rapport PDF
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400"
                onClick={onNewAudit}
              >
                Nouvel audit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilities Details */}
      {audit.scan_details?.vulnerabilities && audit.scan_details.vulnerabilities.length > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Vulnérabilités détectées
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
                      <div className="text-cyan-400 text-sm font-semibold mb-1">Recommandation :</div>
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
              Headers de sécurité
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
              Recommandations prioritaires
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
            Prochaines étapes
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Votre audit est terminé ! Téléchargez votre rapport détaillé et 
            considérez un monitoring continu pour rester protégé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow">
              <FileText className="w-4 h-4 mr-2" />
              Télécharger le rapport complet
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400">
              Activer le monitoring 24/7
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}