

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { Shield, Globe, ChevronDown, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageContext } from '@/components/LanguageContext';

const seoData = {
  fr: {
    Index: {
      title: "CYBAK | Scanner de Sécurité Web par IA pour PME",
      description: "Détectez les failles de sécurité de votre site en 2 minutes. Audit complet, rapport détaillé et plan d'action. Protégez-vous maintenant.",
      keywords: "sécurité site web, audit sécurité, scanner vulnérabilité, cybersécurité pme, test de pénétration automatisé, protection RGPD"
    },
    Payment: {
        title: "Abonnement CYBAK - Sécurisez votre site",
        description: "Finalisez votre abonnement Premium CYBAK pour un accès illimité aux audits de sécurité. Paiement sécurisé via Stripe."
    },
    Dashboard: {
        title: "Tableau de Bord | CYBAK",
        description: "Consultez l'histoire de vos audits de sécurité, suivez votre score et lancez de nouvelles analyses."
    },
    Audit: {
        title: "Lancer un Audit de Sécurité | CYBAK",
        description: "Démarrez une analyse de sécurité complète de votre site web. Plus de 100 tests pour découvrir les failles potentielles."
    },
     AuditResults: {
        title: "Résultats de l'Audit | CYBAK",
        description: "Visualisez les résultats détaillés de votre audit de sécurité, les vulnérabilités trouvées et les recommandations."
    },
    Login: {
        title: "Connexion - CYBAK",
        description: "Accédez à votre compte CYBAK pour gérer vos audits de sécurité et vos abonnements."
    }
  },
  en: {
    Index: {
      title: "CYBAK | AI Website Security Scanner for SMBs",
      description: "Find your website's security flaws in 2 minutes. Comprehensive audit, detailed report, and action plan. Protect your business now.",
      keywords: "website security, security audit, vulnerability scanner, cybersecurity for smb, automated penetration testing, GDPR protection"
    },
    Payment: {
        title: "CYBAK Subscription - Secure Your Website",
        description: "Complete your CYBAK Premium subscription for unlimited access to security audits. Secure payment via Stripe."
    },
    Dashboard: {
        title: "Dashboard | CYBAK",
        description: "View your security audit history, track your security score, and launch new scans."
    },
    Audit: {
        title: "Start a Security Audit | CYBAK",
        description: "Initiate a comprehensive security analysis of your website. Over 100 tests to uncover potential vulnerabilities."
    },
    AuditResults: {
        title: "Audit Results | CYBAK",
        description: "Review detailed results from your security audit, including found vulnerabilities and recommended fixes."
    },
    Login: {
        title: "Login - CYBAK",
        description: "Access your CYBAK account to manage your security audits and subscriptions."
    }
  }
};


export default function Layout({ children }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('fr');
  const { user, loading: isLoadingUser, signOut } = useAuth();
  const currentPageName = getCurrentPageName();

  // Google Analytics GA4 Integration
  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-9L47B6QDBX';
    document.head.appendChild(script1);

    // Initialize Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-9L47B6QDBX', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    // Track page views on route changes
    // Ensure gtag is available before calling it for subsequent page views
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-9L47B6QDBX', {
        page_title: document.title,
        page_location: window.location.href
      });
    }

    return () => {
      // Cleanup scripts on unmount
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, [currentPageName]);

  // X (Twitter) Pixel Integration
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
      },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
      a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
      twq('config','q7nbn');
    `;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // New useEffect for SEO and Metadata
  useEffect(() => {
    // Favicon Setup
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

    const setMetaTag = (attr, key, value) => {
      let element = document.querySelector(`meta[${attr}='${key}']`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    const setLinkTag = (rel, href, hreflang) => {
        let selector = `link[rel='${rel}']`;
        if (hreflang) {
            selector += `[hreflang='${hreflang}']`;
        } else if (rel === 'canonical') {
            // Canonical links typically don't have hreflang. Ensure we don't accidentally match alternates.
            selector += ':not([hreflang])';
        }

        let element = document.querySelector(selector);
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            if (hreflang) element.setAttribute('hreflang', hreflang);
            document.head.appendChild(element);
        }
        element.setAttribute('href', href);
    };

    // SEO & Metadata Management
    const pageKey = currentPageName || 'Index';
    const currentSeoData = seoData[language]?.[pageKey] || seoData[language]?.Index;

    if (currentSeoData) {
      document.title = currentSeoData.title;
      setMetaTag('name', 'description', currentSeoData.description);
      if(currentSeoData.keywords) {
        setMetaTag('name', 'keywords', currentSeoData.keywords);
      }

      // Open Graph & Twitter Cards
      const pageUrl = window.location.href;
      const ogImage = `${window.location.origin}/og-image.jpg`; // Generic OG image
      setMetaTag('property', 'og:title', currentSeoData.title);
      setMetaTag('property', 'og:description', currentSeoData.description);
      setMetaTag('property', 'og:url', pageUrl);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:image', ogImage);
      setMetaTag('property', 'og:site_name', 'CYBAK');
      setMetaTag('property', 'og:locale', language === 'fr' ? 'fr_FR' : 'en_US');
      
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', currentSeoData.title);
      setMetaTag('name', 'twitter:description', currentSeoData.description);
      setMetaTag('name', 'twitter:image', ogImage);

      // Hreflang for international targeting
      const basePagePath = createPageUrl(pageKey); // e.g., "/", "/dashboard"
      
      // Helper to construct localized URLs
      const getLocalizedUrl = (langPrefix) => {
        let pathSegment = basePagePath;
        if (pathSegment === '/') {
          pathSegment = ''; // For root path, no leading slash is needed when constructing local paths
        }
        return window.location.origin + (langPrefix ? `/${langPrefix}` : '') + pathSegment;
      };

      setLinkTag('canonical', window.location.href); // Canonical should be the current URL visited
      setLinkTag('alternate', getLocalizedUrl(''), 'x-default'); // X-default often points to the main non-localized version
      setLinkTag('alternate', getLocalizedUrl('fr'), 'fr-FR');
      setLinkTag('alternate', getLocalizedUrl('ca'), 'fr-CA');
      setLinkTag('alternate', getLocalizedUrl('us'), 'en-US');
      setLinkTag('alternate', getLocalizedUrl('ca-en'), 'en-CA');
    }

    // JSON-LD Structured Data
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CYBAK",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.png`,
      "description": "Expert en cybersécurité, nous protégeons votre présence digitale avec des audits de sécurité avancés.",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@cybak.fr"
      }
    };
    
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Audit de sécurité web",
        "provider": {
            "@type": "Organization",
            "name": "CYBAK"
        },
        "name": "CYBAK Security Scanner",
        "description": "Analyse complète de la sécurité de sites web avec plus de 100 tests automatisés basés sur l'IA.",
        "offers": {
            "@type": "Offer",
            "price": "4.99",
            "priceCurrency": "EUR"
        },
        "areaServed": ["US", "CA", "FR"]
    };

    let schemaElement = document.getElementById('json-ld-schema');
    if (!schemaElement) {
        schemaElement = document.createElement('script');
        schemaElement.type = 'application/ld+json';
        schemaElement.id = 'json-ld-schema';
        document.head.appendChild(schemaElement);
    }
    schemaElement.innerHTML = JSON.stringify([organizationSchema, serviceSchema]);


  }, [currentPageName, language]);

  // Prevent third-party extension interference
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Globally suppress console errors from wallet extensions
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(' ').toLowerCase();
        if (!message.includes('metamask') && !message.includes('ethereum') && !message.includes('wallet')) {
          originalConsoleError.apply(console, args);
        }
      };

      // Prevent MetaMask and other crypto wallet extensions from throwing uncaught errors
      window.addEventListener('error', (e) => {
        if (e.message && (e.message.includes('MetaMask') || e.message.includes('ethereum') || e.message.includes('wallet'))) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);

      // Override any ethereum providers that might be injected by wallets
      if (window.ethereum) {
        window.ethereum = undefined;
      }
      
      // Make the ethereum property non-configurable and non-writable to prevent re-injection
      Object.defineProperty(window, 'ethereum', {
        value: undefined,
        writable: false,
        configurable: false
      });

      // Block common extension events used for announcing providers
      const blockExtensionEvents = ['web3Ready', 'ethereum#initialized', 'eip6963:announceProvider'];
      blockExtensionEvents.forEach(eventName => {
        window.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, true);
      });

      // Cleanup on component unmount
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);
  
  const handleLogout = async () => {
    await signOut();
    navigate(createPageUrl('Index'));
  };

  const handleLogin = () => {
    navigate(createPageUrl('Login'));
  };

  const translations = {
    fr: {
      services: 'Services',
      securityAudit: 'Audit de sécurité',
      monitoring: 'Monitoring 24/7',
      consulting: 'Consultation',
      legal: 'Légal',
      termsOfService: 'Mentions légales',
      privacyPolicy: 'Politique de confidentialité',
      certifications: 'Certifications',
      allRightsReserved: 'Tous droits réservés.',
      expertDescription: 'Expert en cybersécurité, nous protégeons votre présence digitale avec des audits de sécurité avancés.',
      dashboard: 'Tableau de bord',
      logout: 'Déconnexion',
      login: 'Connexion',
      signup: 'S\'abonner - 4,99€/mois',
      signupShort: 'S\'abonner', // Added new translation key
    },
    en: {
      services: 'Services',
      securityAudit: 'Security Audit',
      monitoring: '24/7 Monitoring',
      consulting: 'Consulting',
      legal: 'Legal',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      certifications: 'Certifications',
      allRightsReserved: 'All rights reserved.',
      expertDescription: 'Cybersecurity experts protecting your digital presence with advanced security audits.',
      dashboard: 'Dashboard',
      logout: 'Logout',
      login: 'Login',
      signup: 'Subscribe - €4.99/month',
      signupShort: 'Subscribe', // Added new translation key
    }
  };

  const t = translations[language];

  const renderAuthSection = () => {
    if (isLoadingUser) {
      return <div className="h-8 w-20 sm:w-40 bg-slate-800 rounded animate-pulse" />;
    }
    if (user) {
      return (
        <div className="flex items-center gap-1 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-cyan-500 text-slate-50 px-2 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:bg-accent h-10 border-slate-600 hover:text-cyan-400 hover:border-cyan-400 sm:px-3">
                <UserIcon className="w-4 h-4 sm:mr-2" />
                <span className="truncate max-w-[60px] sm:max-w-[150px] hidden sm:inline">
                  {user.full_name || user.email}
                </span>
                <ChevronDown className="w-4 h-4 ml-1 sm:ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
              <DropdownMenuItem asChild className="hover:!bg-slate-700 focus:!bg-slate-700 cursor:pointer">
                <Link to={createPageUrl('Dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span>{t.dashboard}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="hover:!bg-slate-700 focus:!bg-slate-700 cursor:pointer">
                <LogOut className="w-4 h-4 mr-2" />
                <span>{t.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cybak-glow text-sm px-3 sm:px-4" 
          onClick={handleLogin}
        >
          <span className="hidden sm:inline">{t.signup}</span>
          <span className="sm:hidden">{t.signupShort}</span> {/* Updated to use t.signupShort */}
        </Button>
      </div>
    );
  };

  // On ne veut pas afficher le Layout sur la page de Login
  if (currentPageName === 'Login') {
    return (
       <LanguageContext.Provider value={{ language, setLanguage, t }}>
          {children}
       </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen bg-slate-950">
        <style jsx>{`
          :root {
            --cybak-primary: #0ea5e9;
            --cybak-secondary: #06b6d4;
            --cybak-accent: #00ffff;
            --cybak-dark: #0f172a;
            --cybak-darker: #020617;
          }
          
          .cybak-glow {
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
          }
          
          .cybak-text-glow {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
          
          .cybak-gradient {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }
          
          .cybak-border-glow {
            border: 1px solid rgba(14, 165, 233, 0.3);
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.1);
          }

          /* Prevent extension interference */
          body {
            -webkit-app-region: no-drag;
          }
        `}</style>

        {/* Simplified Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Title */}
              <Link to={createPageUrl('Index')} className="flex-shrink-0 flex items-center space-x-2">
                <Shield className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">CYBAK</span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4">
                {renderAuthSection()}

                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-slate-300 hover:text-white">
                      <Globe className="w-4 h-4 mr-1" />
                      {language.toUpperCase()}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                    <DropdownMenuItem onClick={() => setLanguage('fr')} className="hover:!bg-slate-700 focus:!bg-slate-700">
                      🇫🇷 Français
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('en')} className="hover:!bg-slate-700 focus:!bg-slate-700">
                      🇺🇸 English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>
      </div>
    </LanguageContext.Provider>
  );
}

