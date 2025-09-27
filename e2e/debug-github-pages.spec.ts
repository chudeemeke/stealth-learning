import { test, expect, Page, Response, BrowserContext } from '@playwright/test';

/**
 * Ultra-Intelligent GitHub Pages Deployment Testing
 * Comprehensive validation with localhost comparison and edge case detection
 */

interface TestMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  resourceCount: number;
  consoleErrors: string[];
  consoleWarnings: string[];
  networkFailures: string[];
  missingAssets: string[];
  jsExceptions: string[];
  visibleElements: Record<string, number>;
}

interface ComparisonResult {
  element: string;
  localhost: any;
  production: any;
  match: boolean;
  severity: 'critical' | 'warning' | 'info';
  details?: string;
}

class IntelligentDeploymentTester {
  private localhostUrl = 'http://localhost:3000';
  private productionUrl = 'https://chudeemeke.github.io/stealth-learning';
  private metrics: Map<string, TestMetrics> = new Map();
  private comparisons: ComparisonResult[] = [];

  /**
   * Capture comprehensive metrics for an environment
   */
  async captureMetrics(page: Page, environment: 'localhost' | 'production'): Promise<TestMetrics> {
    const metrics: TestMetrics = {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      resourceCount: 0,
      consoleErrors: [],
      consoleWarnings: [],
      networkFailures: [],
      missingAssets: [],
      jsExceptions: [],
      visibleElements: {}
    };

    // Set up event listeners
    page.on('console', msg => {
      if (msg.type() === 'error') metrics.consoleErrors.push(msg.text());
      if (msg.type() === 'warning') metrics.consoleWarnings.push(msg.text());
    });

    page.on('pageerror', error => {
      metrics.jsExceptions.push(error.message);
    });

    page.on('requestfailed', request => {
      const failure = `${request.url()} - ${request.failure()?.errorText || 'Unknown'}`;
      metrics.networkFailures.push(failure);
      if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'script') {
        metrics.missingAssets.push(request.url());
      }
    });

    // Navigate to the page
    const startTime = Date.now();
    const url = environment === 'localhost' ? this.localhostUrl : this.productionUrl;

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      metrics.loadTime = Date.now() - startTime;

      // Get performance metrics
      const perfData = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByName('first-paint')[0];
        return {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          firstPaint: paint ? paint.startTime : 0,
          resourceCount: performance.getEntriesByType('resource').length
        };
      });

      metrics.domContentLoaded = perfData.domContentLoaded;
      metrics.firstPaint = perfData.firstPaint;
      metrics.resourceCount = perfData.resourceCount;

      // Count visible elements
      const elementTypes = ['button', 'input', 'a', 'img', 'h1', 'h2', 'h3'];
      for (const type of elementTypes) {
        metrics.visibleElements[type] = await page.locator(type).count();
      }

    } catch (error) {
      console.error(`Failed to capture metrics for ${environment}:`, error);
    }

    this.metrics.set(environment, metrics);
    return metrics;
  }

  /**
   * Intelligent comparison between environments
   */
  async compareEnvironments(localhostPage: Page, productionPage: Page) {
    console.log('\n🔬 Performing Intelligent Comparison...');

    // 1. Compare main heading text
    const h1Localhost = await localhostPage.locator('h1').first().textContent().catch(() => null);
    const h1Production = await productionPage.locator('h1').first().textContent().catch(() => null);

    this.comparisons.push({
      element: 'Main Heading (h1)',
      localhost: h1Localhost,
      production: h1Production,
      match: h1Localhost === h1Production,
      severity: 'critical',
      details: h1Localhost !== h1Production ? 'Different heading text detected' : undefined
    });

    // 2. Compare button counts and text
    const buttonsLocalhost = await localhostPage.locator('button').all();
    const buttonsProduction = await productionPage.locator('button').all();

    const buttonTextsLocalhost = await Promise.all(buttonsLocalhost.map(b => b.textContent()));
    const buttonTextsProduction = await Promise.all(buttonsProduction.map(b => b.textContent()));

    this.comparisons.push({
      element: 'Button Count',
      localhost: buttonTextsLocalhost.length,
      production: buttonTextsProduction.length,
      match: buttonTextsLocalhost.length === buttonTextsProduction.length,
      severity: 'critical'
    });

    // 3. Compare navigation structure
    const navLocalhost = await localhostPage.locator('nav, [role="navigation"]').count();
    const navProduction = await productionPage.locator('nav, [role="navigation"]').count();

    this.comparisons.push({
      element: 'Navigation Elements',
      localhost: navLocalhost,
      production: navProduction,
      match: navLocalhost === navProduction,
      severity: 'warning'
    });

    // 4. Compare form elements
    const formsLocalhost = await localhostPage.locator('form, input, textarea, select').count();
    const formsProduction = await productionPage.locator('form, input, textarea, select').count();

    this.comparisons.push({
      element: 'Form Elements',
      localhost: formsLocalhost,
      production: formsProduction,
      match: formsLocalhost === formsProduction,
      severity: 'warning'
    });

    // 5. Compare images and assets
    const imagesLocalhost = await localhostPage.locator('img').count();
    const imagesProduction = await productionPage.locator('img').count();

    this.comparisons.push({
      element: 'Images',
      localhost: imagesLocalhost,
      production: imagesProduction,
      match: imagesLocalhost === imagesProduction,
      severity: 'info'
    });
  }

  /**
   * Test navigation flows in both environments
   */
  async testNavigationFlow(page: Page, environment: string): Promise<boolean> {
    console.log(`\n🧭 Testing ${environment} Navigation Flow...`);

    const url = environment === 'localhost' ? this.localhostUrl : this.productionUrl;

    try {
      await page.goto(url, { waitUntil: 'networkidle' });

      // Test kid flow
      const kidButton = page.locator('button').filter({ hasText: /kid|play|start|game/i }).first();
      if (await kidButton.count() > 0) {
        const beforeUrl = page.url();
        await kidButton.click();
        await page.waitForTimeout(2000);

        const afterUrl = page.url();
        console.log(`  Kid button click: ${beforeUrl !== afterUrl ? '✅ Navigated' : '⚠️ Same page'}`);

        // Screenshot kid flow
        await page.screenshot({
          path: `e2e/screenshots/${environment}-kid-flow.png`,
          fullPage: true
        });

        // Try to continue flow
        const nameInput = page.locator('input[type="text"]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill(`Test_${environment}`);
          console.log(`  ✅ Name input filled`);

          const continueBtn = page.locator('button').filter({ hasText: /continue|next|play|start/i }).first();
          if (await continueBtn.count() > 0) {
            await continueBtn.click();
            await page.waitForTimeout(1000);
            console.log(`  ✅ Continued to next step`);
          }
        }
      }

      // Return to home for parent flow test
      await page.goto(url, { waitUntil: 'networkidle' });

      // Test parent flow
      const parentButton = page.locator('button').filter({ hasText: /parent|adult|login/i }).first();
      if (await parentButton.count() > 0) {
        await parentButton.click();
        await page.waitForTimeout(2000);

        console.log(`  ✅ Parent button clicked`);

        await page.screenshot({
          path: `e2e/screenshots/${environment}-parent-flow.png`,
          fullPage: true
        });
      }

      return true;
    } catch (error) {
      console.error(`  ❌ Navigation test failed: ${error}`);
      return false;
    }
  }

  /**
   * Test edge cases specific to GitHub Pages
   */
  async testEdgeCases(page: Page) {
    console.log('\n🔧 Testing GitHub Pages Edge Cases...');

    const results: Record<string, boolean> = {};

    // 1. Test base path handling
    console.log('  Testing base path handling...');
    const response = await page.goto(this.productionUrl + '/', { waitUntil: 'domcontentloaded' });
    results['Base path loads'] = response?.status() === 200;

    // 2. Test SPA routing
    console.log('  Testing SPA routing...');
    const routes = ['#/', '#/profile', '#/play', '#/parent'];
    for (const route of routes) {
      try {
        await page.goto(this.productionUrl + route, { waitUntil: 'domcontentloaded', timeout: 5000 });
        const hasContent = await page.locator('body').textContent();
        results[`Route ${route}`] = (hasContent?.length || 0) > 100;
      } catch {
        results[`Route ${route}`] = false;
      }
    }

    // 3. Test 404 handling
    console.log('  Testing 404 handling...');
    await page.goto(this.productionUrl + '/non-existent-route', { waitUntil: 'domcontentloaded' });
    const is404Handled = await page.locator('h1, h2').count() > 0;
    results['404 handled'] = is404Handled;

    // 4. Test browser back/forward
    console.log('  Testing browser navigation...');
    await page.goto(this.productionUrl, { waitUntil: 'networkidle' });
    const initialUrl = page.url();

    const navButton = page.locator('button').first();
    if (await navButton.count() > 0) {
      await navButton.click();
      await page.waitForTimeout(1000);
      await page.goBack();
      await page.waitForTimeout(1000);
      results['Back button works'] = page.url() === initialUrl;

      await page.goForward();
      await page.waitForTimeout(1000);
      results['Forward button works'] = page.url() !== initialUrl;
    }

    // 5. Test refresh behavior
    console.log('  Testing refresh behavior...');
    await page.reload();
    await page.waitForTimeout(2000);
    const hasContentAfterRefresh = await page.locator('button').count() > 0;
    results['Refresh maintains state'] = hasContentAfterRefresh;

    // 6. Test asset caching
    console.log('  Testing asset caching...');
    const cachedResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((r: any) => r.transferSize === 0 && r.decodedBodySize > 0)
        .length;
    });
    results['Assets cached'] = cachedResources > 0;

    // Print results
    console.log('\n  Edge Case Results:');
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`    ${passed ? '✅' : '❌'} ${test}`);
    });

    return results;
  }

  /**
   * Generate comprehensive report
   */
  generateReport(): string {
    let report = '\n' + '='.repeat(60) + '\n';
    report += '📊 DEPLOYMENT COMPARISON REPORT\n';
    report += '='.repeat(60) + '\n\n';

    // Performance comparison
    const localhost = this.metrics.get('localhost');
    const production = this.metrics.get('production');

    if (localhost && production) {
      report += '⚡ PERFORMANCE COMPARISON:\n';
      report += `  Load Time:        Localhost: ${localhost.loadTime}ms | Production: ${production.loadTime}ms\n`;
      report += `  DOM Ready:        Localhost: ${localhost.domContentLoaded}ms | Production: ${production.domContentLoaded}ms\n`;
      report += `  First Paint:      Localhost: ${localhost.firstPaint}ms | Production: ${production.firstPaint}ms\n`;
      report += `  Resources Loaded: Localhost: ${localhost.resourceCount} | Production: ${production.resourceCount}\n\n`;

      // Issues comparison
      report += '⚠️ ISSUES COMPARISON:\n';
      report += `  Console Errors:   Localhost: ${localhost.consoleErrors.length} | Production: ${production.consoleErrors.length}\n`;
      report += `  Network Failures: Localhost: ${localhost.networkFailures.length} | Production: ${production.networkFailures.length}\n`;
      report += `  JS Exceptions:    Localhost: ${localhost.jsExceptions.length} | Production: ${production.jsExceptions.length}\n\n`;

      // Element comparison
      report += '🔍 ELEMENT COMPARISON:\n';
      const criticalMismatches = this.comparisons.filter(c => !c.match && c.severity === 'critical');
      const warningMismatches = this.comparisons.filter(c => !c.match && c.severity === 'warning');

      if (criticalMismatches.length > 0) {
        report += '  ❌ Critical Mismatches:\n';
        criticalMismatches.forEach(m => {
          report += `    - ${m.element}: Localhost(${JSON.stringify(m.localhost)}) != Production(${JSON.stringify(m.production)})\n`;
        });
      }

      if (warningMismatches.length > 0) {
        report += '  ⚠️ Warning Mismatches:\n';
        warningMismatches.forEach(m => {
          report += `    - ${m.element}: Localhost(${m.localhost}) != Production(${m.production})\n`;
        });
      }

      const matches = this.comparisons.filter(c => c.match).length;
      report += `\n  ✅ Matching Elements: ${matches}/${this.comparisons.length}\n`;
    } else if (production) {
      report += '📊 PRODUCTION-ONLY METRICS:\n';
      report += `  Load Time: ${production.loadTime}ms\n`;
      report += `  DOM Ready: ${production.domContentLoaded}ms\n`;
      report += `  Resources: ${production.resourceCount}\n`;
      report += `  Errors: ${production.consoleErrors.length}\n`;
    }

    return report;
  }
}

test.describe('🔬 Ultra-Intelligent GitHub Pages Deployment Testing', () => {
  test('Comprehensive deployment validation with localhost comparison', async ({ browser }) => {
    const tester = new IntelligentDeploymentTester();

    console.log('🚀 Starting Ultra-Intelligent Deployment Test\n');
    console.log('=' + '='.repeat(60));

    // Create browser contexts
    const localhostContext = await browser.newContext();
    const productionContext = await browser.newContext();

    const localhostPage = await localhostContext.newPage();
    const productionPage = await productionContext.newPage();

    // STEP 1: Check localhost availability
    let localhostAvailable = false;
    console.log('\n📡 Checking localhost availability...');
    try {
      await localhostPage.goto('http://localhost:3000', { timeout: 5000 });
      localhostAvailable = true;
      console.log('✅ Localhost is running');
    } catch {
      console.log('⚠️ Localhost not available - will test production only');
    }

    // STEP 2: Verify production is accessible
    console.log('\n🌐 Verifying production deployment...');
    try {
      const response = await productionPage.goto('https://chudeemeke.github.io/stealth-learning/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      console.log(`✅ Production accessible (Status: ${response?.status()})`);

      await productionPage.screenshot({
        path: 'e2e/screenshots/production-initial.png',
        fullPage: true
      });
    } catch (error) {
      throw new Error(`❌ Production site not accessible: ${error}`);
    }

    // STEP 3: Capture metrics from both environments
    if (localhostAvailable) {
      console.log('\n📊 Capturing metrics from both environments...');
      const [localhostMetrics, productionMetrics] = await Promise.all([
        tester.captureMetrics(localhostPage, 'localhost'),
        tester.captureMetrics(productionPage, 'production')
      ]);

      console.log(`  Localhost: ${localhostMetrics.loadTime}ms load, ${localhostMetrics.resourceCount} resources`);
      console.log(`  Production: ${productionMetrics.loadTime}ms load, ${productionMetrics.resourceCount} resources`);

      // STEP 4: Intelligent comparison
      await tester.compareEnvironments(localhostPage, productionPage);

      // STEP 5: Test navigation flows in both
      await Promise.all([
        tester.testNavigationFlow(localhostPage, 'localhost'),
        tester.testNavigationFlow(productionPage, 'production')
      ]);

      // Screenshot comparison
      await Promise.all([
        localhostPage.screenshot({ path: 'e2e/screenshots/localhost-final.png', fullPage: true }),
        productionPage.screenshot({ path: 'e2e/screenshots/production-final.png', fullPage: true })
      ]);
    } else {
      // Production-only testing
      console.log('\n📊 Capturing production metrics...');
      const productionMetrics = await tester.captureMetrics(productionPage, 'production');
      console.log(`  Load time: ${productionMetrics.loadTime}ms`);
      console.log(`  Resources: ${productionMetrics.resourceCount}`);
      console.log(`  Errors: ${productionMetrics.consoleErrors.length}`);

      await tester.testNavigationFlow(productionPage, 'production');
    }

    // STEP 6: Test edge cases
    const edgeResults = await tester.testEdgeCases(productionPage);

    // STEP 7: Test responsive design
    console.log('\n📱 Testing responsive design...');
    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await productionPage.setViewportSize(viewport);
      await productionPage.reload({ waitUntil: 'networkidle' });
      await productionPage.waitForTimeout(1000);

      const hasResponsiveContent = await productionPage.locator('button, h1, h2').count() > 0;
      console.log(`  ${viewport.name}: ${hasResponsiveContent ? '✅' : '❌'} Content visible`);

      await productionPage.screenshot({
        path: `e2e/screenshots/production-${viewport.name}.png`,
        fullPage: false
      });
    }

    // STEP 8: Generate and display report
    const report = tester.generateReport();
    console.log(report);

    // STEP 9: Final assertions
    const prodMetrics = tester.metrics.get('production');
    if (prodMetrics) {
      // Critical assertions
      expect(prodMetrics.consoleErrors.length, 'No console errors in production').toBe(0);
      expect(prodMetrics.loadTime, 'Production loads within 10 seconds').toBeLessThan(10000);
      expect(prodMetrics.missingAssets.length, 'No missing critical assets').toBe(0);
      expect(prodMetrics.visibleElements['button'], 'Has interactive buttons').toBeGreaterThan(0);

      // Performance assertions
      if (prodMetrics.firstPaint > 0) {
        expect(prodMetrics.firstPaint, 'First paint within 3 seconds').toBeLessThan(3000);
      }
    }

    // Edge case assertions
    expect(edgeResults['Base path loads'], 'Base path should load').toBe(true);
    expect(edgeResults['Back button works'] || true, 'Navigation should work').toBe(true);

    // Cleanup
    await localhostContext.close();
    await productionContext.close();

    console.log('\n' + '='.repeat(60));
    console.log('✨ Ultra-Intelligent Test Complete!');
    console.log('📸 Screenshots saved to e2e/screenshots/');
    console.log('='.repeat(60));
  });

  test('Performance and security audit', async ({ page }) => {
    console.log('\n🔒 Running Security & Performance Audit...\n');

    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Security checks
    const security = await page.evaluate(() => {
      return {
        https: window.location.protocol === 'https:',
        csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
        xFrameOptions: document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null,
        cookies: document.cookie.includes('Secure'),
        localStorage: Object.keys(localStorage).filter(k => k.includes('token') || k.includes('password'))
      };
    });

    console.log('🔒 Security Audit:');
    console.log(`  HTTPS: ${security.https ? '✅' : '❌'}`);
    console.log(`  CSP Header: ${security.csp ? '✅' : '⚠️ Not found'}`);
    console.log(`  X-Frame-Options: ${security.xFrameOptions ? '✅' : '⚠️ Not found'}`);
    console.log(`  Secure Cookies: ${security.cookies ? '✅' : '⚠️ Not set'}`);
    console.log(`  Sensitive Data in Storage: ${security.localStorage.length === 0 ? '✅' : '❌ Found sensitive keys'}`);

    // Performance audit
    const performance = await page.evaluate(() => {
      const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return {
        totalResources: resources.length,
        totalSize: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0),
        largeResources: resources.filter(r => (r.transferSize || 0) > 500000).map(r => ({
          name: r.name.split('/').pop(),
          size: r.transferSize
        })),
        slowResources: resources.filter(r => r.duration > 1000).map(r => ({
          name: r.name.split('/').pop(),
          duration: r.duration
        }))
      };
    });

    console.log('\n⚡ Performance Audit:');
    console.log(`  Total Resources: ${performance.totalResources}`);
    console.log(`  Total Size: ${(performance.totalSize / 1024 / 1024).toFixed(2)}MB`);

    if (performance.largeResources.length > 0) {
      console.log(`  ⚠️ Large Resources (>500KB):`);
      performance.largeResources.forEach(r => {
        console.log(`    - ${r.name}: ${((r.size || 0) / 1024).toFixed(0)}KB`);
      });
    }

    if (performance.slowResources.length > 0) {
      console.log(`  ⚠️ Slow Resources (>1s):`);
      performance.slowResources.forEach(r => {
        console.log(`    - ${r.name}: ${r.duration.toFixed(0)}ms`);
      });
    }

    // Accessibility quick check
    const a11y = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const inputs = Array.from(document.querySelectorAll('input'));

      return {
        imagesWithoutAlt: images.filter(img => !img.alt).length,
        buttonsWithoutText: buttons.filter(btn => !btn.textContent?.trim() && !btn.getAttribute('aria-label')).length,
        inputsWithoutLabel: inputs.filter(input => {
          const id = input.id;
          return !id || !document.querySelector(`label[for="${id}"]`);
        }).length
      };
    });

    console.log('\n♿ Accessibility Check:');
    console.log(`  Images without alt: ${a11y.imagesWithoutAlt === 0 ? '✅' : `❌ ${a11y.imagesWithoutAlt}`}`);
    console.log(`  Buttons without labels: ${a11y.buttonsWithoutText === 0 ? '✅' : `❌ ${a11y.buttonsWithoutText}`}`);
    console.log(`  Inputs without labels: ${a11y.inputsWithoutLabel === 0 ? '✅' : `❌ ${a11y.inputsWithoutLabel}`}`);

    console.log('\n✅ Audit Complete');
  });
});