import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { Shield, Globe, User, LogOut } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import PricingSection from "../components/home/PricingSection";
import FAQSection from "../components/home/FAQSection";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        // If the user is logged in, automatic redirection to the dashboard
        if (user) {
          navigate(createPageUrl('Dashboard'));
        } else {
          // If the user is not logged in, we stay on the landing page
          setIsLoading(false);
        }
      } catch (error) {
        // If the user is not logged in, we stay on the landing page
        setIsLoading(false);
      }
    };
    checkUserAndRedirect();
  }, [navigate, user]);

  const handleStart = () => {
    // Redirect to sign up page
    navigate(createPageUrl('SignUp'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading CYBAK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">
        {/* Simple Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">CYBAK</span>
              </Link>
              
              {/* Right Section */}
              <div className="flex items-center space-x-4">
                {/* Login Button */}
                {!user ? (
                  <button 
                    onClick={() => navigate('/login')} 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Login
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    <span className="text-white">{user.email}</span>
                  </div>
                )}
                
                {/* Language Switcher */}
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm">EN</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border-r border-cyan-500/20"
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content with padding for header */}
        <div className="relative z-10 pt-16">
          <HeroSection 
            onStart={handleStart}
          />
          <FeaturesSection />
          <TestimonialsSection />
          <PricingSection onStart={handleStart} />
          <FAQSection />
        </div>
      </div>
  );
}
