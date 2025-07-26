import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { LanguageContext } from "@/components/LanguageContext";

export default function TestimonialsSection({ testimonials = [] }) {
  const { language, t: contextT } = useContext(LanguageContext) || { language: 'en', t: {} };
  
  const mockTestimonialsData = {
    fr: [
      {
        id: 1,
        client_name: "Julien Masson",
        testimonial_text: "« On a découvert des failles qu’aucun prestataire précédent n’avait vues. Très impressionné. »",
        rating: 5,
        avatar_url: null,
      },
      {
        id: 2,
        client_name: "Claire Navarro",
        testimonial_text: "« Rapport clair, recommandations utiles, équipe dispo. Rien à redire. »",
        rating: 5,
        avatar_url: null,
      },
      {
        id: 3,
        client_name: "Nicolas Belaïd",
        testimonial_text: "« Audit rapide, super bien documenté. On a corrigé les vulnérabilités en 3 jours. »",
        rating: 5,
        avatar_url: null,
      }
    ],
    en: [
      {
        id: 1,
        client_name: "John Smith",
        testimonial_text: "\"We discovered vulnerabilities that no previous provider had seen. Very impressed.\"",
        rating: 5,
        avatar_url: null,
      },
      {
        id: 2,
        client_name: "Sarah Miller",
        testimonial_text: "\"Clear report, useful recommendations, and a responsive team. Nothing to complain about.\"",
        rating: 5,
        avatar_url: null,
      },
      {
        id: 3,
        client_name: "Mike Johnson",
        testimonial_text: "\"Quick audit, extremely well-documented. We fixed the vulnerabilities in 3 days.\"",
        rating: 5,
        avatar_url: null,
      }
    ]
  };

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : mockTestimonialsData[language];

  const translations = {
    fr: {
      title: "Ce que disent nos clients",
      subtitle: "Des témoignages authentiques de professionnels satisfaits",
    },
    en: {
      title: "What our clients say",
      subtitle: "Authentic testimonials from satisfied professionals",
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="py-20 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-300"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:cybak-glow transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-cyan-400 mb-4" />
                  
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                        }`} 
                      />
                    ))}
                  </div>

                  <p className="text-slate-300 mb-6 leading-relaxed italic">
                    {testimonial.testimonial_text}
                  </p>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-slate-700">
                      {testimonial.avatar_url ? (
                        <img 
                          src={testimonial.avatar_url} 
                          alt={testimonial.client_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold">
                          {testimonial.client_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.client_name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}