
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Play, ArrowRight, Globe, Lock, CheckCircle, CreditCard, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ onStart }) {
  const [typedText, setTypedText] = useState("");
  const fullText = "Professional Security Scanner for Modern Websites";

  useEffect(() => {
    setTypedText("");
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [fullText]);

  return (
    <div className="pt-20"> {/* Changed: Removed 'relative' and 'overflow-hidden' from this div */}
      {/* Animated Background */}
      <div className="absolute inset-0"> {/* This div will now position relative to the viewport or nearest positioned ancestor */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="border-r border-cyan-500/20 animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 rounded-full border border-green-500/20">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Enterprise-Grade Security Testing</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Protect Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 cybak-text-glow">
                  {" Business"}
                </span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-6xl">From Cyber Threats</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Advanced vulnerability scanner that identifies security risks in your website. 
                Get comprehensive reports with actionable insights in minutes.
              </p>

              <div className="flex items-center justify-center space-x-2 text-cyan-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-lg font-medium">{typedText}</span>
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 cybak-border-glow max-w-2xl mx-auto border border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-yellow-400 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Limited Time Offer: $4.99/month</span>
                </div>
                
                <Button 
                  onClick={onStart}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow h-14 px-10 text-lg font-semibold w-full shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Start Your Security Audit Now
                </Button>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
                
                <p className="text-center text-xs text-slate-500 mt-4">
                  Secure payment processing • 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Real Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold text-cyan-400">100+</div>
                <span className="text-slate-400 text-sm">Security Tests</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold text-green-400">2 min</div>
                <span className="text-slate-400 text-sm">Scan Time</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <span className="text-slate-400 text-sm">Monitoring</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold text-purple-400">SSL</div>
                <span className="text-slate-400 text-sm">Encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
