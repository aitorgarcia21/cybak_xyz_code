import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Zap, ArrowRight, Shield, CreditCard, Lock, Globe, Eye, AlertTriangle, FileCode, List, Server, TrendingUp } from "lucide-react";

export default function PricingSection({ onStart }) {

  const plan = {
    name: "Professional Security Suite",
    price: "4.99",
    currency: "$",
    period: "/month",
    description: "Complete website security monitoring with real-time alerts and expert support",
    icon: Shield,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/50",
    glowColor: "cybak-glow",
    badge: "Most Popular",
    features: [
      "Unlimited security scans",
      "Real-time vulnerability detection",
      "Detailed PDF reports",
      "24/7 email support",
      "Security score tracking",
      "Fix recommendations"
    ],
    scansPerformed: "What's included in every scan:",
    scansList: [
      "SSL/TLS certificate validation",
      "Security headers analysis",
      "Mixed content detection",
      "CMS vulnerability checks",
      "Exposed sensitive files",
      "Directory traversal tests",
      "Port security scanning",
      "Data exposure detection"
    ],
    cta: "Start Free Trial",
  };

  const scanIcons = [Lock, Shield, Eye, AlertTriangle, FileCode, List, Server, Globe];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 rounded-full border border-green-500/20 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Simple, Transparent Pricing</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Protect Your Business Today
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            Get unlimited security scans and expert guidance for one low monthly price. 
            No setup fees, no hidden costs, cancel anytime.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <Card className={`bg-slate-800/50 backdrop-blur-sm ${plan.borderColor} border-2 h-full relative overflow-hidden group hover:scale-105 transition-all duration-300 ${plan.glowColor}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/20"></div>
              
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
              
              <CardHeader className="text-center pb-8 relative z-10">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Shield className={`w-8 h-8 ${plan.color}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-slate-400 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-slate-400 text-lg align-top">{plan.currency}</span>
                  <span className={`text-5xl font-bold ${plan.color}`}>
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2">
                    {plan.period}
                  </span>
                </div>
                
                <div className="text-sm text-green-400 font-medium">
                  ✓ 7-day free trial • ✓ Cancel anytime
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Security Scans */}
                <div className="mb-8 p-4 bg-slate-900/30 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    {plan.scansPerformed}
                  </h4>
                  <ul className="space-y-2">
                    {plan.scansList.map((scan, scanIndex) => {
                      const IconComponent = scanIcons[scanIndex] || CheckCircle;
                      return (
                        <li key={scanIndex} className="flex items-center text-sm">
                          <IconComponent className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">{scan}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Button 
                  onClick={onStart}
                  className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 text-lg transition-all duration-300 group`}
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  {plan.cta}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}