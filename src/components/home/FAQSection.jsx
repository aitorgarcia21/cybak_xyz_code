
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LanguageContext } from "@/components/LanguageContext";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState(new Set([0]));
  const { language } = useContext(LanguageContext) || { language: 'fr' };

  const translations = {
    fr: {
      title: "Questions fréquentes",
      subtitle: "Trouvez rapidement les réponses à vos questions",
      faqs: [
        {
          question: "Mes données sont-elles en sécurité lors de l'audit ?",
          answer: "Absolument. Nos processus s'alignent sur les exigences d'ISO 27001 et nous suivons le référentiel PCI-DSS. Nous ne stockons aucune donnée sensible et tous nos scans sont effectués de manière éthique et légale. Vos informations sont chiffrées en transit et au repos."
        },
        {
          question: "L'audit CYBAK est-il légal ?",
          answer: "Oui, nos audits respectent strictement les lois en vigueur. Nous effectuons uniquement des tests passifs et conformes aux standards éthiques. Nous recommandons de scanner uniquement les sites dont vous êtes propriétaire ou avez l'autorisation."
        },
        {
          question: "Que se passe-t-il si des failles critiques sont trouvées ?",
          answer: "Vous recevrez immédiatement un rapport détaillé avec la classification des failles (critiques, majeures, mineures) et un plan d'action prioritaire. Notre équipe support peut vous accompagner dans la résolution si nécessaire."
        },
        {
          question: "CYBAK peut-il auditer tous types de sites web ?",
          answer: "CYBAK analyse la plupart des technologies web : WordPress, Drupal, e-commerce, applications SaaS, APIs REST, etc. Nos 100+ tests couvrent les vulnérabilités OWASP Top 10 et bien plus."
        },
        {
          question: "Quelle est la différence avec les autres scanners gratuits ?",
          answer: "CYBAK utilise une IA propriétaire qui analyse plus de 100 vecteurs d'attaque, là où les outils gratuits se limitent à 10-20 tests basiques. De plus, nous fournissons des rapports détaillés avec recommandations personnalisées."
        },
        {
          question: "Le support technique est-il inclus ?",
          answer: "Oui ! Chaque plan inclut un support par email. Les clients Pro et Enterprise bénéficient d'un support prioritaire et téléphonique. Notre équipe d'experts répond sous 2h en moyenne."
        },
        {
          question: "Puis-je annuler mon abonnement à tout moment ?",
          answer: "Absolument. Aucun engagement, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Nous appliquons également une garantie satisfait ou remboursé de 30 jours."
        },
        {
          question: "CYBAK est-il conforme au RGPD ?",
          answer: "Oui, CYBAK est 100% conforme au RGPD. Nous sommes hébergés en Europe, ne collectons que les données nécessaires et vous gardez le contrôle total sur vos informations avec possibilité de suppression à tout moment."
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to your questions quickly",
      faqs: [
        {
          question: "Are my data secure during the audit?",
          answer: "Absolutely. Our processes align with ISO 27001 requirements and we follow PCI-DSS standards. We don't store any sensitive data and all our scans are performed ethically and legally. Your information is encrypted in transit and at rest."
        },
        {
          question: "Is CYBAK audit legal?",
          answer: "Yes, our audits strictly comply with applicable laws. We only perform passive tests that conform to ethical standards. We recommend scanning only websites you own or have authorization for."
        },
        {
          question: "What happens if critical vulnerabilities are found?",
          answer: "You'll immediately receive a detailed report with vulnerability classification (critical, major, minor) and a priority action plan. Our support team can assist you with remediation if needed."
        },
        {
          question: "Can CYBAK audit all types of websites?",
          answer: "CYBAK analyzes most web technologies: WordPress, Drupal, e-commerce, SaaS applications, REST APIs, etc. Our 100+ tests cover OWASP Top 10 vulnerabilities and much more."
        },
        {
          question: "What's the difference with other free scanners?",
          answer: "CYBAK uses proprietary AI that analyzes over 100 attack vectors, while free tools are limited to 10-20 basic tests. Additionally, we provide detailed reports with personalized recommendations."
        },
        {
          question: "Is technical support included?",
          answer: "Yes! Every plan includes email support. Pro and Enterprise customers benefit from priority and phone support. Our expert team responds within 2 hours on average."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Absolutely. No commitment, you can cancel your subscription anytime from your dashboard. We also offer a 30-day money-back guarantee."
        },
        {
          question: "Is CYBAK GDPR compliant?",
          answer: "Yes, CYBAK is 100% GDPR compliant. We're hosted in Europe, collect only necessary data, and you maintain full control over your information with deletion possible at any time."
        }
      ]
    }
  };

  const t = translations[language] || translations.fr;

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

        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:cybak-glow transition-all duration-300">
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
