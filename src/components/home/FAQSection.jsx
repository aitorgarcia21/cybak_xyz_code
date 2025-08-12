
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState(new Set([0]));

  const faqs = [
    {
      question: "Is my data secure during the security scan?",
      answer: "Yes, absolutely. We perform only passive, read-only scans that don't modify or store any of your data. All communications are encrypted using industry-standard SSL/TLS protocols. We never store sensitive information from your website."
    },
    {
      question: "Is the CYBAK security scan legal?",
      answer: "Yes, our scans are completely legal as they only perform passive analysis similar to what search engines do. However, we recommend scanning only websites you own or have explicit permission to test. Our scans comply with ethical security testing standards."
    },
    {
      question: "What happens if vulnerabilities are found?",
      answer: "You'll receive a detailed report categorizing issues by severity (critical, high, medium, low). Each vulnerability includes a clear explanation, potential impact, and step-by-step remediation guidance. Our support team is available to help you understand and address the findings."
    },
    {
      question: "What types of websites can CYBAK scan?",
      answer: "CYBAK can analyze most web technologies including WordPress, Shopify, custom applications, REST APIs, and more. Our scanner performs over 100 security checks covering common vulnerabilities, misconfigurations, and security best practices."
    },
    {
      question: "How is CYBAK different from free security scanners?",
      answer: "While free tools typically run 10-20 basic checks, CYBAK performs 100+ comprehensive tests. We provide detailed, actionable reports with prioritized fixes, continuous monitoring options, and professional support to help you implement security improvements."
    },
    {
      question: "What kind of support is included?",
      answer: "All plans include email support with typical response times under 24 hours. We help you understand scan results, prioritize fixes, and provide guidance on security best practices. Our team is here to ensure you can effectively improve your website's security."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time directly from your dashboard. There are no long-term contracts or cancellation fees. We also offer a 7-day free trial so you can test our service risk-free."
    },
    {
      question: "How do you handle privacy and data protection?",
      answer: "We take privacy seriously. We only collect minimal data necessary for the service, never sell your information, and you can request data deletion at any time. Our systems use encryption and follow security best practices to protect your information."
    }
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="py-20 bg-slate-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-indigo-500/20 mb-6"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-400 text-sm font-medium">Got Questions? We've Got Answers</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            Everything you need to know about securing your website with CYBAK
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    {openItems.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.has(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
