
import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Plus, 
  Download, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  CreditCard 
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/LanguageContext";

export default function Dashboard() {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    fr: {
      dashboard: "Tableau de bord",
      overviewDescription: "Vue d'overview de vos audits de sécurité",
      newAudit: "Nouvel audit",
      activateSubscription: "Activez votre abonnement Premium",
      subscribeDescription: "Abonnez-vous pour débloquer les audits de sécurité illimités.",
      subscribe: "S'abonner - 4,99€/mois",
      totalAudits: "Total audits",
      averageScore: "Score moyen",
      detectedIssues: "Issues détectées",
      lastAudit: "Dernier audit",
      auditHistory: "Historique des audits",
      noAudits: "Aucun audit",
      noAuditsDescription: "Commencez par effectuer votre premier audit de sécurité",
      firstAudit: "Premier audit",
      completed: "Terminé",
      inProgress: "En cours",
      failed: "Échec",
      pending: "En attente",
      view: "Voir",
      delete: "Supprimer",
      score: "Score",
      issues: "issues",
      loading: "Chargement du tableau de bord...",
      reactivatePrompt: "Votre abonnement est inactif. Pour lancer un nouvel audit, vous devez d'abord réactiver votre abonnement. Continuer vers la page de paiement ?"
    },
    en: {
      dashboard: "Dashboard",
      overviewDescription: "Overview of your security audits",
      newAudit: "New audit",
      activateSubscription: "Activate your Premium subscription",
      subscribeDescription: "Subscribe to unlock unlimited security audits.",
      subscribe: "Subscribe - €4.99/month",
      totalAudits: "Total audits",
      averageScore: "Average score",
      detectedIssues: "Detected issues",
      lastAudit: "Last audit",
      auditHistory: "Audit history",
      noAudits: "No audits",
      noAuditsDescription: "Start by performing your first security audit",
      firstAudit: "First audit",
      completed: "Completed",
      inProgress: "In progress",
      failed: "Failed",
      pending: "Pending",
      view: "View",
      delete: "Delete",
      score: "Score",
      issues: "issues",
      loading: "Loading dashboard...",
      reactivatePrompt: "Your subscription is inactive. To launch a new audit, you must first reactivate your subscription. Continue to payment page?"
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    const loadAudits = async () => {
      if (!user) {
        navigate(createPageUrl('Login'));
        return;
      }
      
      setIsLoading(true);
      try {
        // Load user's audits from Supabase
        const { data, error } = await db.audits.getByUserId(user.id);
        if (error) {
          console.error('Error loading audits:', error);
        } else {
          setAudits(data || []);
        }
        
        // Check subscription status (you can add this logic based on your needs)
        setIsSubscriptionActive(user.user_metadata?.subscription_status === 'active');
      } catch (error) {
        console.error('Error in loadAudits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAudits();
  }, [user, navigate]);

  const deleteAudit = async (auditId) => {
    if (!user) return;
    try {
      const { error } = await db.audits.delete(auditId);
      if (error) {
        console.error('Error deleting audit:', error);
        return;
      }
      
      // Reload audits after deletion
      const { data } = await db.audits.getByUserId(user.id);
      setAudits(data || []);
    } catch (error) {
      console.error("Error deleting audit:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "scanning":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  const totalAudits = audits.length;
  const completedAudits = audits.filter(a => a.status === "completed");
  const avgScore = completedAudits.length > 0 
    ? (completedAudits.reduce((sum, a) => sum + (a.security_score || 0), 0) / completedAudits.length).toFixed(1)
    : 0;
  const totalIssues = completedAudits.reduce((sum, a) => sum + (a.critical_issues || 0) + (a.major_issues || 0) + (a.minor_issues || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.dashboard}</h1>
            <p className="text-slate-300 mt-1">{t.overviewDescription}</p>
          </div>
          <Button
            onClick={() => {
              if (isSubscriptionActive) {
                navigate(createPageUrl('Audit'));
              } else {
                const confirmReactivation = window.confirm(t.reactivatePrompt);
                if (confirmReactivation) {
                  if (user && user.email) {
                    window.location.href = `https://buy.stripe.com/6oU6oH6Y4702g0b5uegMw09?prefilled_email=${encodeURIComponent(user.email)}`;
                  } else {
                    window.location.href = `https://buy.stripe.com/6oU6oH6Y4702g0b5uegMw09`;
                  }
                }
              }
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow"
            title={!isSubscriptionActive ? t.reactivatePrompt : t.newAudit}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.newAudit}
          </Button>
        </div>

        {!isSubscriptionActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-yellow-900/20 border border-yellow-500/30">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{t.activateSubscription}</h3>
                    <p className="text-yellow-200">{t.subscribeDescription}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    if (user && user.email) {
                      window.location.href = `https://buy.stripe.com/6oU6oH6Y4702g0b5uegMw09?prefilled_email=${encodeURIComponent(user.email)}`;
                    } else {
                      window.location.href = `https://buy.stripe.com/6oU6oH6Y4702g0b5uegMw09`;
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full md:w-auto"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t.subscribe}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t.totalAudits}</p>
                  <p className="text-2xl font-bold text-white">{totalAudits}</p>
                </div>
                <FileText className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t.averageScore}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}/100</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t.detectedIssues}</p>
                  <p className="text-2xl font-bold text-red-400">{totalIssues}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t.lastAudit}</p>
                  <p className="text-2xl font-bold text-white">
                    {audits[0] ? format(new Date(audits[0].created_date), "dd/MM") : "-"}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audits List */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 cybak-border-glow">
          <CardHeader>
            <CardTitle className="text-white">{t.auditHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            {audits.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t.noAudits}</h3>
                <p className="text-slate-400 mb-6">{t.noAuditsDescription}</p>
                <Link to={createPageUrl("Audit")}>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.firstAudit}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {audits.map((audit, index) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-slate-900/50 rounded-lg p-6 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold truncate">
                            {audit.website_url}
                          </h3>
                          <Badge className={`${getStatusColor(audit.status)} border`}>
                            {audit.status === "completed" ? t.completed : 
                             audit.status === "scanning" ? t.inProgress : 
                             audit.status === "failed" ? t.failed : t.pending}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-x-6 gap-y-2 text-sm text-slate-400 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(audit.created_date), "dd/MM/yyyy à HH:mm")}
                          </div>
                          
                          {audit.status === "completed" && (
                            <>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {t.score}: <span className={getScoreColor(audit.security_score)}>{audit.security_score}/100</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" />
                                {(audit.critical_issues || 0) + (audit.major_issues || 0) + (audit.minor_issues || 0)} {t.issues}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {audit.status === "completed" && (
                          <Link to={createPageUrl(`AuditResults?id=${audit.id}`)}>
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400">
                              <Eye className="w-4 h-4 mr-2" />
                              {t.view}
                            </Button>
                          </Link>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                          onClick={() => deleteAudit(audit.id)}
                        >
                          {t.delete}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
