import React, { createContext, useContext, useState, useEffect } from 'react'

// Créer le contexte de langue
const LanguageContext = createContext()

// Provider pour gérer la langue
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupérer la langue depuis localStorage ou utiliser 'en' par défaut
    return localStorage.getItem('cybak-language') || 'en'
  })

  // Sauvegarder la langue dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cybak-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr')
  }

  // Wrapper pour setLanguage qui sauvegarde automatiquement
  const setLanguageWithPersistence = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('cybak-language', newLanguage)
  }

  const value = {
    language,
    setLanguage: setLanguageWithPersistence,
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
