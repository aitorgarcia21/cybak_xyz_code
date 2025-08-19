import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LanguageContext } from "@/context/LanguageContext";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const { language } = useContext(LanguageContext) || { language: 'en' };

  const translations = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about CYBAK security scanning",
      contactSupport: "Contact our support team",
      faqs: [
        {
          question: "Are my data secure during the scan?",
          answer: "Yes, absolutely. We only perform passive read-only scans that do not modify or store your data. All communications are encrypted with standard SSL/TLS protocols. We never store sensitive information from your website."
        },
        {
          question: "Is CYBAK security scanning legal?",
          answer: "Yes, our scans are completely legal as they only perform passive analysis similar to what search engines do. However, we recommend scanning only websites you own or have explicit authorization for."
        },
        {
          question: "What happens if vulnerabilities are found?",
          answer: "You will receive a detailed report categorizing issues by severity (critical, high, medium, low). Each vulnerability includes a clear explanation, potential impact, and step-by-step remediation advice. Our support team is available to help you."
        },
        {
          question: "What types of websites can CYBAK scan?",
          answer: "CYBAK can analyze most web technologies including WordPress, Shopify, custom applications, REST APIs, and more. Our scanner performs over 100 security checks covering common vulnerabilities and best practices."
        },
        {
          question: "How does CYBAK differ from free scanners?",
          answer: "While free tools typically perform 10-20 basic checks, CYBAK performs over 100 comprehensive tests. We provide detailed and actionable reports with prioritized fixes, continuous monitoring options, and professional support."
        },
        {
          question: "What type of support is included?",
          answer: "All plans include email support with detailed explanations of vulnerabilities and remediation steps. Premium plans include priority support with faster response times and direct access to our security experts."
        }
      ]
    },
    fr: {
      title: "Questions Fréquemment Posées",
      subtitle: "Tout ce que vous devez savoir sur le scan de sécurité CYBAK",
      contactSupport: "Contactez notre équipe support",
      faqs: [
        {
          question: "Mes données sont-elles sécurisées pendant le scan ?",
          answer: "Oui, absolument. Nous effectuons uniquement des scans passifs en lecture seule qui ne modifient ni ne stockent vos données. Toutes les communications sont chiffrées avec les protocoles SSL/TLS standard. Nous ne stockons jamais d'informations sensibles de votre site web."
        },
        {
          question: "Le scan de sécurité CYBAK est-il légal ?",
          answer: "Oui, nos scans sont complètement légaux car ils effectuent uniquement une analyse passive similaire à ce que font les moteurs de recherche. Cependant, nous recommandons de scanner uniquement les sites web que vous possédez ou pour lesquels vous avez une autorisation explicite."
        },
        {
          question: "Que se passe-t-il si des vulnérabilités sont trouvées ?",
          answer: "Vous recevrez un rapport détaillé catégorisant les problèmes par gravité (critique, élevé, moyen, faible). Chaque vulnérabilité inclut une explication claire, l'impact potentiel, et des conseils de correction étape par étape. Notre équipe support est disponible pour vous aider."
        },
        {
          question: "Quels types de sites web CYBAK peut-il scanner ?",
          answer: "CYBAK peut analyser la plupart des technologies web incluant WordPress, Shopify, applications personnalisées, API REST, et plus. Notre scanner effectue plus de 100 vérifications de sécurité couvrant les vulnérabilités communes et les bonnes pratiques."
        },
        {
          question: "En quoi CYBAK diffère-t-il des scanners gratuits ?",
          answer: "Alors que les outils gratuits effectuent typiquement 10-20 vérifications basiques, CYBAK effectue plus de 100 tests complets. Nous fournissons des rapports détaillés et actionnables avec des corrections priorisées, des options de surveillance continue, et un support professionnel."
        },
        {
          question: "Quel type de support est inclus ?",
          answer: "Tous les plans incluent un support par email avec des explications détaillées des vulnérabilités et des étapes de remédiation. Les plans premium incluent un support prioritaire avec des temps de réponse plus rapides et un accès direct à nos experts en sécurité."
        }
      ]
    }
  };

  const t = translations[language] || translations.en;

  const faqs = [
    {
      question: "Mes données sont-elles sécurisées pendant le scan ?",
      answer: "Oui, absolument. Nous effectuons uniquement des scans passifs en lecture seule qui ne modifient ni ne stockent vos données. Toutes les communications sont chiffrées avec les protocoles SSL/TLS standard. Nous ne stockons jamais d'informations sensibles de votre site web."
    },
    {
      question: "Le scan de sécurité CYBAK est-il légal ?",
      answer: "Oui, nos scans sont complètement légaux car ils effectuent uniquement une analyse passive similaire à ce que font les moteurs de recherche. Cependant, nous recommandons de scanner uniquement les sites web que vous possédez ou pour lesquels vous avez une autorisation explicite."
    },
    {
      question: "Que se passe-t-il si des vulnérabilités sont trouvées ?",
      answer: "Vous recevrez un rapport détaillé catégorisant les problèmes par gravité (critique, élevé, moyen, faible). Chaque vulnérabilité inclut une explication claire, l'impact potentiel, et des conseils de correction étape par étape. Notre équipe support est disponible pour vous aider."
    },
    {
      question: "Quels types de sites web CYBAK peut-il scanner ?",
      answer: "CYBAK peut analyser la plupart des technologies web incluant WordPress, Shopify, applications personnalisées, API REST, et plus. Notre scanner effectue plus de 100 vérifications de sécurité couvrant les vulnérabilités communes et les bonnes pratiques."
    },
    {
      question: "En quoi CYBAK diffère-t-il des scanners gratuits ?",
      answer: "Alors que les outils gratuits effectuent typiquement 10-20 vérifications basiques, CYBAK effectue plus de 100 tests complets. Nous fournissons des rapports détaillés et actionnables avec des corrections priorisées, des options de surveillance continue, et un support professionnel."
    },
    {
      question: "Quel type de support est inclus ?",
      answer: "Tous les plans incluent un support par email avec des temps de réponse typiques sous 24 heures. Nous vous aidons à comprendre les résultats du scan, prioriser les corrections, et fournissons des conseils sur les bonnes pratiques de sécurité."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment directement depuis votre tableau de bord. Il n'y a pas de contrats à long terme ou de frais d'annulation. Nous offrons aussi un essai gratuit de 7 jours pour tester notre service sans risque."
    },
    {
      question: "Comment gérez-vous la confidentialité et la protection des données ?",
      answer: "Nous prenons la confidentialité au sérieux. Nous collectons uniquement les données minimales nécessaires au service, ne vendons jamais vos informations, et vous pouvez demander la suppression des données à tout moment. Nos systèmes utilisent le chiffrement et suivent les bonnes pratiques de sécurité."
    }
  ];

  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 hover:bg-slate-700/50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
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
          <p className="text-slate-300 mb-2">
            Vous avez encore des questions ?
          </p>
          <a 
            href="mailto:support@cybak.xyz" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t.contactSupport}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
