#!/usr/bin/env node

/**
 * Script de test d'accessibilité pour CYBAK
 * Utilise axe-core pour détecter les problèmes d'accessibilité
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const PAGES_TO_TEST = [
  { name: 'Home', path: '/' },
  { name: 'SignUp', path: '/signup' },
  { name: 'Login', path: '/login' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Audit', path: '/audit' }
];

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testPage(browser, pageInfo) {
  const page = await browser.newPage();
  
  try {
    console.log(`\n${colors.cyan}Testing ${pageInfo.name}...${colors.reset}`);
    
    // Navigation vers la page
    await page.goto(`${BASE_URL}${pageInfo.path}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Attendre que le contenu soit chargé
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Exécuter les tests d'accessibilité
    const results = await new AxePuppeteer(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    
    return {
      page: pageInfo.name,
      url: `${BASE_URL}${pageInfo.path}`,
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete
    };
  } catch (error) {
    console.error(`${colors.red}Error testing ${pageInfo.name}: ${error.message}${colors.reset}`);
    return {
      page: pageInfo.name,
      url: `${BASE_URL}${pageInfo.path}`,
      error: error.message,
      violations: [],
      passes: 0,
      incomplete: []
    };
  } finally {
    await page.close();
  }
}

function formatViolation(violation) {
  const impact = violation.impact;
  const impactColor = 
    impact === 'critical' ? colors.red :
    impact === 'serious' ? colors.red :
    impact === 'moderate' ? colors.yellow :
    colors.blue;
  
  return `
  ${colors.bright}Issue:${colors.reset} ${violation.description}
  ${colors.bright}Impact:${colors.reset} ${impactColor}${violation.impact.toUpperCase()}${colors.reset}
  ${colors.bright}Help:${colors.reset} ${violation.helpUrl}
  ${colors.bright}Elements affected:${colors.reset} ${violation.nodes.length}
  ${violation.nodes.slice(0, 3).map(node => `    - ${node.target.join(' > ')}`).join('\n')}
  ${violation.nodes.length > 3 ? `    ... and ${violation.nodes.length - 3} more` : ''}`;
}

async function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CYBAK - Rapport d'Accessibilité</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #22d3ee;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 2.5rem;
    }
    .summary {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid #475569;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .stat {
      text-align: center;
      padding: 1rem;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 0.25rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #94a3b8;
      font-size: 0.875rem;
    }
    .page-section {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid #475569;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #475569;
    }
    .page-title {
      color: #22d3ee;
      font-size: 1.5rem;
    }
    .violation {
      background: rgba(15, 23, 42, 0.5);
      border-left: 3px solid;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.25rem;
    }
    .violation.critical { border-color: #ef4444; }
    .violation.serious { border-color: #f97316; }
    .violation.moderate { border-color: #eab308; }
    .violation.minor { border-color: #3b82f6; }
    .violation-header {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .violation-impact {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 0.5rem;
    }
    .impact-critical { background: #ef4444; color: white; }
    .impact-serious { background: #f97316; color: white; }
    .impact-moderate { background: #eab308; color: black; }
    .impact-minor { background: #3b82f6; color: white; }
    .elements-list {
      margin-top: 0.5rem;
      padding-left: 1.5rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    .success { color: #10b981; }
    .error { color: #ef4444; }
    .warning { color: #eab308; }
    .timestamp {
      text-align: center;
      color: #64748b;
      margin-top: 2rem;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛡️ CYBAK - Rapport d'Accessibilité</h1>
    
    <div class="summary">
      <div class="stat">
        <div class="stat-value">${results.reduce((acc, r) => acc + r.violations.length, 0)}</div>
        <div class="stat-label">Violations Totales</div>
      </div>
      <div class="stat">
        <div class="stat-value">${results.length}</div>
        <div class="stat-label">Pages Testées</div>
      </div>
      <div class="stat">
        <div class="stat-value success">${results.reduce((acc, r) => acc + r.passes, 0)}</div>
        <div class="stat-label">Tests Réussis</div>
      </div>
      <div class="stat">
        <div class="stat-value warning">${results.reduce((acc, r) => acc + r.incomplete.length, 0)}</div>
        <div class="stat-label">Tests Incomplets</div>
      </div>
    </div>
    
    ${results.map(pageResult => `
      <div class="page-section">
        <div class="page-header">
          <h2 class="page-title">${pageResult.page}</h2>
          <div>
            <span class="success">✓ ${pageResult.passes} passes</span> | 
            <span class="error">✗ ${pageResult.violations.length} violations</span>
          </div>
        </div>
        
        ${pageResult.error ? `
          <div class="violation critical">
            <div class="violation-header">Erreur de test</div>
            <div>${pageResult.error}</div>
          </div>
        ` : ''}
        
        ${pageResult.violations.map(violation => `
          <div class="violation ${violation.impact}">
            <div class="violation-header">
              ${violation.description}
              <span class="violation-impact impact-${violation.impact}">${violation.impact}</span>
            </div>
            <div class="elements-list">
              Éléments affectés: ${violation.nodes.length}
              <ul>
                ${violation.nodes.slice(0, 3).map(node => 
                  `<li>${node.target.join(' > ')}</li>`
                ).join('')}
                ${violation.nodes.length > 3 ? `<li>... et ${violation.nodes.length - 3} autres</li>` : ''}
              </ul>
            </div>
          </div>
        `).join('')}
        
        ${pageResult.violations.length === 0 && !pageResult.error ? `
          <div class="success">✓ Aucune violation d'accessibilité détectée</div>
        ` : ''}
      </div>
    `).join('')}
    
    <div class="timestamp">
      Rapport généré le ${new Date().toLocaleString('fr-FR')}
    </div>
  </div>
</body>
</html>
  `;
  
  const reportPath = path.join(process.cwd(), 'accessibility-report.html');
  await fs.writeFile(reportPath, html);
  return reportPath;
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}🛡️  CYBAK Accessibility Testing${colors.reset}`);
  console.log(`${colors.bright}================================${colors.reset}\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const results = [];
    
    // Tester chaque page
    for (const pageInfo of PAGES_TO_TEST) {
      const result = await testPage(browser, pageInfo);
      results.push(result);
    }
    
    // Afficher le résumé
    console.log(`\n${colors.bright}${colors.cyan}📊 Summary${colors.reset}`);
    console.log(`${colors.bright}==========${colors.reset}\n`);
    
    let totalViolations = 0;
    let totalPasses = 0;
    let criticalCount = 0;
    let seriousCount = 0;
    
    for (const result of results) {
      const violationCount = result.violations.length;
      totalViolations += violationCount;
      totalPasses += result.passes;
      
      // Compter par sévérité
      result.violations.forEach(v => {
        if (v.impact === 'critical') criticalCount++;
        if (v.impact === 'serious') seriousCount++;
      });
      
      const statusIcon = violationCount === 0 ? '✅' : violationCount > 3 ? '❌' : '⚠️';
      console.log(`${statusIcon} ${result.page}: ${violationCount} violations, ${result.passes} passes`);
      
      // Afficher les violations critiques
      if (violationCount > 0) {
        result.violations.slice(0, 3).forEach(violation => {
          console.log(formatViolation(violation));
        });
      }
    }
    
    // Score d'accessibilité
    const totalTests = totalViolations + totalPasses;
    const score = totalTests > 0 ? Math.round((totalPasses / totalTests) * 100) : 0;
    
    console.log(`\n${colors.bright}Overall Accessibility Score: ${score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red}${score}%${colors.reset}`);
    console.log(`${colors.bright}Total Violations: ${totalViolations === 0 ? colors.green : colors.red}${totalViolations}${colors.reset}`);
    
    if (criticalCount > 0) {
      console.log(`${colors.red}⚠️  ${criticalCount} CRITICAL issues found!${colors.reset}`);
    }
    if (seriousCount > 0) {
      console.log(`${colors.yellow}⚠️  ${seriousCount} SERIOUS issues found${colors.reset}`);
    }
    
    // Générer le rapport HTML
    const reportPath = await generateHTMLReport(results);
    console.log(`\n${colors.green}✅ HTML report generated: ${reportPath}${colors.reset}`);
    
    // Sauvegarder les résultats JSON
    const jsonPath = path.join(process.cwd(), 'accessibility-results.json');
    await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));
    console.log(`${colors.green}✅ JSON results saved: ${jsonPath}${colors.reset}`);
    
    // Exit code basé sur les violations critiques
    process.exit(criticalCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Lancer le test
main().catch(console.error);
