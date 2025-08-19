import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection({ testimonials = [] }) {
  const mockTestimonialsData = [
    {
      name: "Michael Chen",
      role: "CTO at TechStart",
      content: "CYBAK helped us identify and fix critical vulnerabilities before they could be exploited. The reports are clear and actionable.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Security Lead at FinanceHub",
      content: "The continuous monitoring gives us peace of mind. We get instant alerts and the remediation guides are incredibly helpful.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "IT Director at GlobalRetail",
      content: "Fast, accurate, and comprehensive. Found issues that other scanners missed. Excellent value for the price.",
      rating: 5
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : mockTestimonialsData;

  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
          >
            Trusted by Security Teams
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            See what our customers have to say about CYBAK
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-slate-900 text-slate-900" />
                ))}
              </div>
              
              <p className="text-slate-700 mb-6 leading-relaxed">
                {testimonial.content}
              </p>
              
              <div className="pt-6 border-t border-slate-100">
                <div className="font-semibold text-slate-900">{testimonial.name}</div>
                <div className="text-sm text-slate-500">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-1 text-slate-600">
            <Star className="w-5 h-5 fill-slate-900 text-slate-900" />
            <span className="font-medium">4.9/5</span>
            <span className="text-slate-500">from 2,000+ reviews</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}