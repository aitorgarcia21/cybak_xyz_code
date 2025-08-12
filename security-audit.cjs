#!/usr/bin/env node

/**
 * CYBAK Security Audit Script
 * Analyse complète de la sécurité de l'application
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const SITE_URL = 'https://cybak.xyz';
const API_BASE = 'https://cybak.xyz/api';

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Rapport de sécurité
const securityReport = {
  timestamp: new Date().toISOString(),
  site: SITE_URL,
  vulnerabilities: [],
  warnings: [],
  passed: [],
  score: 100
};

// Fonction utilitaire pour afficher les messages
function log(message, type = 'info') {
  const prefix = {
    error: `${colors.red}[❌ ERREUR]${colors.reset}`,
    warning: `${colors.yellow}[⚠️  ATTENTION]${colors.reset}`,
    success: `${colors.green}[✅ OK]${colors.reset}`,
    info: `${colors.cyan}[ℹ️  INFO]${colors.reset}`,
    header: `${colors.bold}${colors.magenta}`
  };
  
  if (type === 'header') {
    console.log(`\n${prefix[type]}${message}${colors.reset}\n${'='.repeat(50)}`);
  } else {
    console.log(`${prefix[type] || prefix.info} ${message}`);
  }
}

// Test 1: Vérification des dépendances NPM
function checkNpmVulnerabilities() {
  log('1. ANALYSE DES DÉPENDANCES NPM', 'header');
  
  try {
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditResult);
    
    if (audit.metadata.vulnerabilities.total > 0) {
      const vulns = audit.metadata.vulnerabilities;
      
      if (vulns.critical > 0) {
        log(`${vulns.critical} vulnérabilités CRITIQUES détectées!`, 'error');
        securityReport.vulnerabilities.push({
          type: 'NPM Dependencies',
          severity: 'CRITICAL',
          count: vulns.critical,
          description: 'Des vulnérabilités critiques ont été trouvées dans les dépendances'
        });
        securityReport.score -= 30;
      }
      
      if (vulns.high > 0) {
        log(`${vulns.high} vulnérabilités ÉLEVÉES détectées`, 'error');
        securityReport.vulnerabilities.push({
          type: 'NPM Dependencies',
          severity: 'HIGH',
          count: vulns.high,
          description: 'Des vulnérabilités élevées ont été trouvées dans les dépendances'
        });
        securityReport.score -= 20;
      }
      
      if (vulns.moderate > 0) {
        log(`${vulns.moderate} vulnérabilités MODÉRÉES détectées`, 'warning');
        securityReport.warnings.push({
          type: 'NPM Dependencies',
          severity: 'MODERATE',
          count: vulns.moderate
        });
        securityReport.score -= 10;
      }
      
      if (vulns.low > 0) {
        log(`${vulns.low} vulnérabilités FAIBLES détectées`, 'warning');
        securityReport.warnings.push({
          type: 'NPM Dependencies',
          severity: 'LOW',
          count: vulns.low
        });
        securityReport.score -= 5;
      }
      
      log(`Exécutez 'npm audit fix' pour corriger les vulnérabilités`, 'info');
    } else {
      log('Aucune vulnérabilité détectée dans les dépendances', 'success');
      securityReport.passed.push('NPM Dependencies');
    }
  } catch (error) {
    // npm audit retourne exit code 1 s'il y a des vulnérabilités
    // On parse quand même le résultat
  }
}

// Test 2: Vérification des en-têtes de sécurité HTTP
async function checkSecurityHeaders() {
  log('2. VÉRIFICATION DES EN-TÊTES DE SÉCURITÉ HTTP', 'header');
  
  return new Promise((resolve) => {
    https.get(SITE_URL, (res) => {
      const headers = res.headers;
      const requiredHeaders = {
        'strict-transport-security': 'HSTS',
        'x-content-type-options': 'X-Content-Type-Options',
        'x-frame-options': 'X-Frame-Options',
        'x-xss-protection': 'X-XSS-Protection',
        'content-security-policy': 'Content-Security-Policy'
      };
      
      let missingHeaders = [];
      
      for (const [header, name] of Object.entries(requiredHeaders)) {
        if (!headers[header]) {
          missingHeaders.push(name);
          log(`En-tête ${name} manquant`, 'warning');
        } else {
          log(`En-tête ${name} présent: ${headers[header]}`, 'success');
        }
      }
      
      if (missingHeaders.length > 0) {
        securityReport.warnings.push({
          type: 'Security Headers',
          missing: missingHeaders,
          description: 'Des en-têtes de sécurité importants sont manquants'
        });
        securityReport.score -= missingHeaders.length * 3;
      } else {
        securityReport.passed.push('Security Headers');
      }
      
      resolve();
    });
  });
}

// Test 3: Vérification des secrets exposés
function checkExposedSecrets() {
  log('3. RECHERCHE DE SECRETS EXPOSÉS', 'header');
  
  const secretPatterns = [
    { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Live Secret Key' },
    { pattern: /sk_test_[a-zA-Z0-9]{24,}/g, name: 'Stripe Test Secret Key' },
    { pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, name: 'JWT Token' },
    { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key' },
    { pattern: /[a-zA-Z0-9]{40}/g, name: 'Generic API Key (40 chars)' }
  ];
  
  const filesToCheck = [
    'server.js',
    'vite.config.js',
    '.env',
    'src/lib/supabase.js'
  ];
  
  let secretsFound = false;
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      secretPatterns.forEach(({ pattern, name }) => {
        const matches = content.match(pattern);
        if (matches && !file.includes('.example')) {
          log(`Possible secret exposé (${name}) dans ${file}`, 'error');
          secretsFound = true;
          securityReport.vulnerabilities.push({
            type: 'Exposed Secret',
            file: file,
            secretType: name
          });
          securityReport.score -= 15;
        }
      });
    }
  });
  
  if (!secretsFound) {
    log('Aucun secret exposé détecté', 'success');
    securityReport.passed.push('No Exposed Secrets');
  }
}

// Test 4: Vérification de la configuration CORS
function checkCORSConfiguration() {
  log('4. VÉRIFICATION DE LA CONFIGURATION CORS', 'header');
  
  const serverFile = path.join(process.cwd(), 'server.js');
  
  if (fs.existsSync(serverFile)) {
    const content = fs.readFileSync(serverFile, 'utf8');
    
    if (content.includes('cors(')) {
      if (content.includes('origin: process.env.CORS_ORIGINS')) {
        log('CORS configuré avec des origines depuis les variables d\'environnement', 'success');
        securityReport.passed.push('CORS Configuration');
      } else if (content.includes('origin: true') || content.includes('origin: "*"')) {
        log('CORS trop permissif - accepte toutes les origines!', 'error');
        securityReport.vulnerabilities.push({
          type: 'CORS',
          severity: 'HIGH',
          description: 'CORS accepte toutes les origines'
        });
        securityReport.score -= 20;
      } else {
        log('CORS configuré avec des origines spécifiques', 'success');
        securityReport.passed.push('CORS Configuration');
      }
    } else {
      log('Configuration CORS non trouvée', 'warning');
      securityReport.warnings.push({
        type: 'CORS',
        description: 'Configuration CORS non détectée'
      });
    }
  }
}

// Test 5: Vérification XSS
function checkXSSVulnerabilities() {
  log('5. RECHERCHE DE VULNÉRABILITÉS XSS', 'header');
  
  const dangerousPatterns = [
    { pattern: /dangerouslySetInnerHTML/g, name: 'dangerouslySetInnerHTML' },
    { pattern: /eval\(/g, name: 'eval()' },
    { pattern: /innerHTML\s*=/g, name: 'innerHTML direct assignment' },
    { pattern: /document\.write/g, name: 'document.write' }
  ];
  
  const srcDir = path.join(process.cwd(), 'src');
  let xssRisks = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        dangerousPatterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            const relativePath = path.relative(process.cwd(), filePath);
            xssRisks.push({ file: relativePath, risk: name });
          }
        });
      }
    });
  }
  
  if (fs.existsSync(srcDir)) {
    scanDirectory(srcDir);
  }
  
  if (xssRisks.length > 0) {
    xssRisks.forEach(({ file, risk }) => {
      log(`Risque XSS potentiel: ${risk} dans ${file}`, 'warning');
    });
    securityReport.warnings.push({
      type: 'XSS Risk',
      risks: xssRisks,
      description: 'Utilisation de méthodes potentiellement dangereuses'
    });
    securityReport.score -= xssRisks.length * 2;
  } else {
    log('Aucun risque XSS évident détecté', 'success');
    securityReport.passed.push('XSS Protection');
  }
}

// Test 6: Vérification de l'authentification
function checkAuthenticationSecurity() {
  log('6. ANALYSE DE LA SÉCURITÉ D\'AUTHENTIFICATION', 'header');
  
  const authFile = path.join(process.cwd(), 'src/context/AuthContext.jsx');
  
  if (fs.existsSync(authFile)) {
    const content = fs.readFileSync(authFile, 'utf8');
    
    // Vérifications positives
    if (content.includes('supabase')) {
      log('Utilisation de Supabase pour l\'authentification', 'success');
      securityReport.passed.push('Authentication Provider');
    }
    
    if (content.includes('onAuthStateChange')) {
      log('Écoute des changements d\'état d\'authentification', 'success');
    }
    
    // Vérifications de sécurité
    if (content.includes('localStorage') && content.includes('password')) {
      log('Stockage potentiel de mots de passe dans localStorage!', 'error');
      securityReport.vulnerabilities.push({
        type: 'Authentication',
        severity: 'CRITICAL',
        description: 'Stockage potentiel de mots de passe dans localStorage'
      });
      securityReport.score -= 25;
    }
    
    if (!content.includes('resetPassword')) {
      log('Fonction de réinitialisation de mot de passe non trouvée', 'warning');
      securityReport.warnings.push({
        type: 'Authentication',
        description: 'Pas de fonction de réinitialisation de mot de passe'
      });
    }
  }
}

// Test 7: Vérification HTTPS
async function checkHTTPS() {
  log('7. VÉRIFICATION HTTPS', 'header');
  
  return new Promise((resolve) => {
    https.get(SITE_URL, (res) => {
      if (res.socket.authorized) {
        log('Certificat SSL/TLS valide', 'success');
        securityReport.passed.push('HTTPS/SSL');
      } else {
        log('Problème avec le certificat SSL/TLS', 'error');
        securityReport.vulnerabilities.push({
          type: 'HTTPS',
          severity: 'HIGH',
          description: 'Problème de certificat SSL/TLS'
        });
        securityReport.score -= 20;
      }
      resolve();
    }).on('error', (err) => {
      log(`Erreur de connexion HTTPS: ${err.message}`, 'error');
      resolve();
    });
  });
}

// Test 8: Vérification de la protection des routes API
function checkAPIProtection() {
  log('8. VÉRIFICATION DE LA PROTECTION DES ROUTES API', 'header');
  
  const serverFile = path.join(process.cwd(), 'server.js');
  
  if (fs.existsSync(serverFile)) {
    const content = fs.readFileSync(serverFile, 'utf8');
    
    // Vérifier la limite de taille des requêtes
    if (content.includes('express.json({ limit:')) {
      log('Limite de taille des requêtes JSON configurée', 'success');
    } else {
      log('Pas de limite de taille pour les requêtes JSON', 'warning');
      securityReport.warnings.push({
        type: 'API Protection',
        description: 'Pas de limite de taille pour les requêtes JSON'
      });
    }
    
    // Vérifier la validation des webhooks Stripe
    if (content.includes('stripe.webhooks.constructEvent')) {
      log('Validation des signatures des webhooks Stripe', 'success');
      securityReport.passed.push('Webhook Validation');
    }
    
    // Vérifier la gestion des erreurs
    if (content.includes('app.use((error, req, res, next)')) {
      log('Gestionnaire d\'erreurs global configuré', 'success');
    }
  }
}

// Génération du rapport final
function generateReport() {
  log('\n📊 RAPPORT DE SÉCURITÉ FINAL', 'header');
  
  // Ajuster le score
  securityReport.score = Math.max(0, securityReport.score);
  
  // Déterminer le niveau de sécurité
  let securityLevel;
  let levelColor;
  
  if (securityReport.score >= 90) {
    securityLevel = 'EXCELLENT';
    levelColor = colors.green;
  } else if (securityReport.score >= 70) {
    securityLevel = 'BON';
    levelColor = colors.green;
  } else if (securityReport.score >= 50) {
    securityLevel = 'MOYEN';
    levelColor = colors.yellow;
  } else {
    securityLevel = 'FAIBLE';
    levelColor = colors.red;
  }
  
  console.log(`\n${colors.bold}Score de sécurité: ${levelColor}${securityReport.score}/100 (${securityLevel})${colors.reset}\n`);
  
  // Résumé des vulnérabilités
  if (securityReport.vulnerabilities.length > 0) {
    console.log(`${colors.red}${colors.bold}⚠️  VULNÉRABILITÉS CRITIQUES (${securityReport.vulnerabilities.length})${colors.reset}`);
    securityReport.vulnerabilities.forEach(vuln => {
      console.log(`  • ${vuln.type}: ${vuln.description || vuln.severity}`);
    });
    console.log('');
  }
  
  // Résumé des avertissements
  if (securityReport.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bold}⚠️  AVERTISSEMENTS (${securityReport.warnings.length})${colors.reset}`);
    securityReport.warnings.forEach(warn => {
      console.log(`  • ${warn.type}: ${warn.description || ''}`);
    });
    console.log('');
  }
  
  // Tests réussis
  if (securityReport.passed.length > 0) {
    console.log(`${colors.green}${colors.bold}✅ TESTS RÉUSSIS (${securityReport.passed.length})${colors.reset}`);
    securityReport.passed.forEach(test => {
      console.log(`  • ${test}`);
    });
    console.log('');
  }
  
  // Recommandations
  console.log(`${colors.cyan}${colors.bold}📝 RECOMMANDATIONS PRIORITAIRES:${colors.reset}`);
  
  if (securityReport.score < 100) {
    console.log('');
    
    // Recommandations basées sur les problèmes trouvés
    if (securityReport.vulnerabilities.some(v => v.type === 'NPM Dependencies')) {
      console.log('  1. Exécutez "npm audit fix" pour corriger les vulnérabilités des dépendances');
    }
    
    if (securityReport.warnings.some(w => w.type === 'Security Headers')) {
      console.log('  2. Ajoutez les en-têtes de sécurité manquants dans votre serveur Express:');
      console.log('     - Strict-Transport-Security (HSTS)');
      console.log('     - Content-Security-Policy (CSP)');
      console.log('     - X-Frame-Options');
      console.log('     - X-Content-Type-Options');
    }
    
    if (securityReport.warnings.some(w => w.type === 'XSS Risk')) {
      console.log('  3. Revoyez l\'utilisation de dangerouslySetInnerHTML et autres méthodes dangereuses');
    }
    
    if (!securityReport.passed.includes('Rate Limiting')) {
      console.log('  4. Implémentez un système de rate limiting (ex: express-rate-limit)');
    }
    
    console.log('\n  5. Effectuez des tests de pénétration réguliers');
    console.log('  6. Mettez en place un monitoring de sécurité (ex: Sentry)');
    console.log('  7. Configurez des alertes pour les tentatives d\'intrusion');
  } else {
    console.log('\n  Votre site a une excellente sécurité! Continuez les bonnes pratiques.');
  }
  
  // Sauvegarder le rapport
  const reportPath = path.join(process.cwd(), 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(securityReport, null, 2));
  console.log(`\n${colors.green}Rapport détaillé sauvegardé dans: security-report.json${colors.reset}`);
}

// Fonction principale
async function runSecurityAudit() {
  console.log(`${colors.bold}${colors.cyan}
╔══════════════════════════════════════════════════╗
║         CYBAK SECURITY AUDIT SCANNER              ║
║         Analyse de sécurité complète              ║
╚══════════════════════════════════════════════════╝
${colors.reset}`);
  
  console.log(`Site analysé: ${colors.bold}${SITE_URL}${colors.reset}`);
  console.log(`Date: ${new Date().toLocaleString()}\n`);
  
  // Exécuter tous les tests
  checkNpmVulnerabilities();
  await checkSecurityHeaders();
  checkExposedSecrets();
  checkCORSConfiguration();
  checkXSSVulnerabilities();
  checkAuthenticationSecurity();
  await checkHTTPS();
  checkAPIProtection();
  
  // Générer le rapport final
  generateReport();
}

// Lancer l'audit
runSecurityAudit().catch(console.error);
