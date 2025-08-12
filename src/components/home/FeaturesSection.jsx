
import React from "react";
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
  FileText,
  Search,
  FileSearch,
  ShieldCheck
} from "lucide-react";

export default function FeaturesSection() {

  const processSteps = [
    {
      step: "01",
      title: "Enter Your Website URL",
      description: "Simply input your website address to begin the comprehensive security assessment",
      icon: Search,
      color: "from-cyan-500 to-blue-500"
    },
    {
      step: "02", 
      title: "Automated Security Analysis",
      description: "Our advanced scanner performs 100+ security checks in real-time",
      icon: FileSearch,
      color: "from-blue-500 to-purple-500"
    },
    {
      step: "03",
      title: "Get Your Security Report",
      description: "Receive detailed findings with prioritized fixes and implementation guides",
      icon: ShieldCheck,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Process Steps */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 rounded-full border border-blue-500/20 mb-6"
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Quick & Easy Process</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            Get comprehensive security insights in just 3 simple steps
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
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/50 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">{step.step}</div>
                      <step.icon className="w-8 h-8 text-cyan-400 mx-auto" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
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
