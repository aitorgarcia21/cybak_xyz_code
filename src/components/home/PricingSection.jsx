import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export default function PricingSection({ onStart }) {

  return (
    <div className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Tarifs Simples et Transparents
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
Commencez avec un essai gratuit de 7 jours. Aucune carte de crédit requise.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">Débutant</h3>
                  <p className="text-slate-400 text-sm">Pour les petits sites web</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">Gratuit</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 mb-8"
                  onClick={onStart}
                >
                  Commencer
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Scan de sécurité basique</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Rapports mensuels</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Support par email</span>
                  </li>
                </ul>
              </div>

              {/* Professional Plan - Highlighted */}
              <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 text-white transform scale-105 border border-cyan-500/30">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    PLUS POPULAIRE
                  </span>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">Professionnel</h3>
                  <p className="text-slate-400 text-sm">Pour les entreprises en croissance</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-slate-400">/mois</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white mb-8"
                  onClick={onStart}
                >
                  Essai Gratuit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">100+ tests de sécurité</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Surveillance en temps réel</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Scans automatisés hebdomadaires</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Support prioritaire</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Accès API</span>
                  </li>
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">Entreprise</h3>
                  <p className="text-slate-400 text-sm">Pour les grandes organisations</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">Sur mesure</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 mb-8"
                  onClick={onStart}
                >
                  Contacter les Ventes
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Tout ce qui est dans Pro</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Intégrations personnalisées</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Support dédié</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">Garantie SLA</span>
                  </li>
                </ul>
              </div>
        </div>
      </div>
    </div>
  );
}