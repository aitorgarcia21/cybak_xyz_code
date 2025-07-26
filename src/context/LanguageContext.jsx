import React, { createContext, useContext, useState } from 'react'

// Créer le contexte de langue
const LanguageContext = createContext()

// Provider pour gérer la langue
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr') // Français par défaut

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Export du contexte pour compatibilité
export { LanguageContext }
export default LanguageContext
