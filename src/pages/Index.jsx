import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import Layout from "./Layout";
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
    <Layout>
      <div className="relative overflow-hidden bg-slate-950 text-white">
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
        
        {/* Content on top */}
        <div className="relative z-10">
          <HeroSection 
            onStart={handleStart}
          />
          <FeaturesSection />
          <TestimonialsSection />
          <PricingSection onStart={handleStart} />
          <FAQSection />
        </div>
      </div>
    </Layout>
  );
}
