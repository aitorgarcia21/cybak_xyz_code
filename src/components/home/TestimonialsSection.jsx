import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Building2, Briefcase, Store } from "lucide-react";

export default function TestimonialsSection({ testimonials = [] }) {
  const mockTestimonialsData = [
    {
      id: 1,
      client_name: "Michael Chen",
      role: "IT Director",
      company: "TechStart Inc.",
      testimonial_text: "The security scan identified critical vulnerabilities we weren't aware of. The detailed report helped us fix them quickly.",
      rating: 5,
      icon: Building2,
    },
    {
      id: 2,
      client_name: "Emma Rodriguez",
      role: "CTO",
      company: "Digital Solutions LLC",
      testimonial_text: "Fast, comprehensive, and easy to understand. The actionable recommendations saved us hours of research.",
      rating: 5,
      icon: Briefcase,
    },
    {
      id: 3,
      client_name: "David Park",
      role: "Owner",
      company: "E-Commerce Plus",
      testimonial_text: "As a small business owner, I needed an affordable security solution. CYBAK delivered exactly what I needed.",
      rating: 5,
      icon: Store,
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : mockTestimonialsData;

  return (
    <div className="py-20 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-6"
          >
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Customer Success Stories</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Trusted by Businesses Worldwide
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            See how companies are securing their digital assets with CYBAK
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
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-all duration-300 h-full group">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Quote className="w-8 h-8 text-cyan-400/50" />
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-300 mb-6 leading-relaxed flex-grow">
                    "{testimonial.testimonial_text}"
                  </p>

                  <div className="border-t border-slate-700 pt-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        {testimonial.icon ? (
                          <testimonial.icon className="w-6 h-6 text-cyan-400" />
                        ) : (
                          <div className="text-cyan-400 font-bold text-lg">
                            {testimonial.client_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {testimonial.client_name}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {testimonial.role && `${testimonial.role}, `}{testimonial.company}
                        </div>
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