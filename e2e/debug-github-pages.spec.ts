import { test, expect } from '@playwright/test';

test.describe('🔬 Ultra-Intelligent GitHub Pages Deployment Debugger', () => {
  test('Comprehensive deployment analysis with edge case detection', async ({ page, context }) => {
    // ========== SETUP: ERROR CAPTURE SYSTEM ==========
    const diagnostics = {
      consoleErrors: [] as string[],
      consoleWarnings: [] as string[],
      consoleLogs: [] as string[],
      networkFailures: [] as string[],
      slowRequests: [] as { url: string; duration: number }[],
      jsExceptions: [] as string[],
      resourceTimings: [] as { url: string; duration: number; type: string }[],
      missingAssets: [] as string[],
      corsIssues: [] as string[],
      cspViolations: [] as string[]
    };

    // Capture ALL console messages
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();

      if (type === 'error') {
        diagnostics.consoleErrors.push(text);
        console.log('❌ Console Error:', text);
      } else if (type === 'warning') {
        diagnostics.consoleWarnings.push(text);
        console.log('⚠️ Console Warning:', text);
      } else if (type === 'log' && text.includes('error')) {
        diagnostics.consoleLogs.push(text);
      }
    });

    // Capture page errors (uncaught exceptions)
    page.on('pageerror', error => {
      diagnostics.jsExceptions.push(error.message);
      console.log('💥 JavaScript Exception:', error.message);
    });

    // Track network activity
    page.on('requestfailed', request => {
      const failure = `${request.url()} - ${request.failure()?.errorText}`;
      diagnostics.networkFailures.push(failure);

      if (request.url().includes('stealth-learning')) {
        diagnostics.missingAssets.push(request.url());
      }

      console.log('🔴 Failed Request:', failure);
    });

    // Track slow requests
    page.on('response', async response => {
      try {
        const timing = response.timing ? response.timing() : null;
        if (timing && timing.responseEnd > 1000) {
          diagnostics.slowRequests.push({
            url: response.url(),
            duration: timing.responseEnd
          });
        }
      } catch (e) {
        // Timing not available in all contexts
      }

      // Check for CORS issues
      if (response.status() === 0 || response.status() >= 400) {
        if (response.headers()['access-control-allow-origin']) {
          diagnostics.corsIssues.push(response.url());
        }
      }
    });

    console.log('🚀 Starting Ultra-Intelligent Deployment Analysis...\n');

    // ========== TEST 1: INITIAL LOAD ANALYSIS ==========
    console.log('📋 TEST 1: Initial Load Analysis');
    console.log('=================================');

    const startTime = Date.now();

    try {
      await page.goto('https://chudeemeke.github.io/stealth-learning/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
    } catch (error) {
      console.log('❌ Initial navigation failed:', error);

      // Try alternative approaches
      console.log('🔄 Attempting fallback navigation...');
      await page.goto('https://chudeemeke.github.io/stealth-learning/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
    }

    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Page load time: ${loadTime}ms`);

    // Capture initial state
    await page.screenshot({
      path: 'e2e/screenshots/gh-debug-1-initial.png',
      fullPage: true
    });

    // ========== TEST 2: LOADING SCREEN DETECTION ==========
    console.log('\n📋 TEST 2: Loading Screen Analysis');
    console.log('===================================');

    // Check for loading indicators
    const loadingIndicators = [
      { selector: '.loading', name: 'Loading class' },
      { selector: '[class*="load"]', name: 'Load-related classes' },
      { selector: 'text=/loading/i', name: 'Loading text' },
      { selector: '.spinner', name: 'Spinner' },
      { selector: '[class*="spinner"]', name: 'Spinner classes' },
      { selector: 'svg[class*="animate"]', name: 'Animated SVG' }
    ];

    for (const indicator of loadingIndicators) {
      const count = await page.locator(indicator.selector).count();
      if (count > 0) {
        console.log(`✅ Found ${indicator.name}: ${count} instance(s)`);

        // Wait for it to disappear
        try {
          await page.locator(indicator.selector).first().waitFor({ state: 'hidden', timeout: 10000 });
          console.log(`  ✓ ${indicator.name} disappeared`);
        } catch {
          console.log(`  ❌ ${indicator.name} still visible after 10s`);
        }
      }
    }

    await page.screenshot({
      path: 'e2e/screenshots/gh-debug-2-after-loading.png',
      fullPage: true
    });

    // ========== TEST 3: BLACK SCREEN DETECTION ==========
    console.log('\n📋 TEST 3: Black Screen Detection');
    console.log('=================================');

    // Check background color
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        opacity: computed.opacity,
        visibility: computed.visibility,
        display: computed.display,
        overflow: computed.overflow
      };
    });

    console.log('Body styles:', bodyStyles);

    // Check if screen is actually black
    const isBlack = bodyStyles.backgroundColor === 'rgb(0, 0, 0)' ||
                    bodyStyles.backgroundColor === 'rgba(0, 0, 0, 1)' ||
                    bodyStyles.backgroundColor === '#000000';

    if (isBlack) {
      console.log('❌ BLACK SCREEN DETECTED!');

      // Try to find what's hiding the content
      const overlays = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const overlays = [];

        for (const el of elements) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'absolute') {
            if (style.backgroundColor.includes('0, 0, 0') ||
                style.backgroundColor === 'black' ||
                parseInt(style.zIndex) > 1000) {
              overlays.push({
                tag: el.tagName,
                classes: el.className,
                id: el.id,
                zIndex: style.zIndex,
                backgroundColor: style.backgroundColor,
                dimensions: `${el.clientWidth}x${el.clientHeight}`
              });
            }
          }
        }
        return overlays;
      });

      if (overlays.length > 0) {
        console.log('Found potential overlay elements:', overlays);
      }
    }

    // ========== TEST 4: REACT APP DETECTION ==========
    console.log('\n📋 TEST 4: React Application Detection');
    console.log('======================================');

    // Check if React is loaded
    const reactStatus = await page.evaluate(() => {
      return {
        hasReact: typeof (window as any).React !== 'undefined',
        hasReactDOM: typeof (window as any).ReactDOM !== 'undefined',
        reactVersion: (window as any).React?.version || 'Not found',
        rootElement: document.getElementById('root')?.innerHTML.length || 0,
        reactFiberRoot: !!(document.getElementById('root') as any)?._reactRootContainer
      };
    });

    console.log('React Status:', reactStatus);

    // Check for React DevTools
    const hasReactDevTools = await page.evaluate(() => {
      return !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    });
    console.log('React DevTools available:', hasReactDevTools);

    // ========== TEST 5: CONTENT VISIBILITY ==========
    console.log('\n📋 TEST 5: Content Visibility Check');
    console.log('====================================');

    const contentChecks = [
      { selector: 'button', name: 'Buttons' },
      { selector: 'a', name: 'Links' },
      { selector: 'img', name: 'Images' },
      { selector: 'h1, h2, h3, h4, h5, h6', name: 'Headings' },
      { selector: 'text=/Play Games/i', name: 'Play Games button' },
      { selector: 'text=/Kids/i', name: 'Kids section' },
      { selector: 'text=/Parent/i', name: 'Parent section' },
      { selector: '.container, [class*="container"]', name: 'Container elements' },
      { selector: '.app, [class*="app"]', name: 'App elements' }
    ];

    for (const check of contentChecks) {
      const count = await page.locator(check.selector).count();
      const visible = await page.locator(check.selector).first().isVisible().catch(() => false);
      console.log(`${check.name}: ${count} found, ${visible ? 'visible' : 'not visible'}`);
    }

    // ========== TEST 6: ROUTING STRATEGIES ==========
    console.log('\n📋 TEST 6: Testing Different Routing Strategies');
    console.log('================================================');

    const routes = [
      { url: 'https://chudeemeke.github.io/stealth-learning/', name: 'Base URL' },
      { url: 'https://chudeemeke.github.io/stealth-learning/#/', name: 'Hash root' },
      { url: 'https://chudeemeke.github.io/stealth-learning/index.html', name: 'Direct index' },
      { url: 'https://chudeemeke.github.io/stealth-learning/?/', name: 'Query routing' }
    ];

    for (const route of routes) {
      console.log(`\nTesting: ${route.name}`);
      await page.goto(route.url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(2000);

      const hasContent = await page.locator('button').count() > 0;
      const visibleText = await page.locator('body').textContent();

      console.log(`  - Has interactive content: ${hasContent}`);
      console.log(`  - Text content length: ${visibleText?.length || 0}`);

      if (hasContent) {
        console.log(`  ✅ ${route.name} WORKS!`);
        await page.screenshot({
          path: `e2e/screenshots/gh-debug-route-${route.name.replace(/\s+/g, '-').toLowerCase()}.png`
        });
        break; // Found working route
      }
    }

    // ========== TEST 7: ASSET LOADING VERIFICATION ==========
    console.log('\n📋 TEST 7: Asset Loading Verification');
    console.log('=====================================');

    // Check critical assets
    const criticalAssets = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

      return {
        scripts: scripts.map(s => ({
          src: s.src,
          async: s.async,
          defer: s.defer,
          module: s.type === 'module',
          loaded: !s.src || (s as any).loaded !== false
        })),
        styles: styles.map(s => ({
          href: (s as HTMLLinkElement).href,
          loaded: (s as any).sheet !== null
        }))
      };
    });

    console.log('Scripts loaded:', criticalAssets.scripts.filter(s => s.loaded).length, '/', criticalAssets.scripts.length);
    console.log('Styles loaded:', criticalAssets.styles.filter(s => s.loaded).length, '/', criticalAssets.styles.length);

    // List failed scripts
    const failedScripts = criticalAssets.scripts.filter(s => !s.loaded);
    if (failedScripts.length > 0) {
      console.log('❌ Failed scripts:', failedScripts);
    }

    // ========== TEST 8: LOCAL STORAGE & COOKIES ==========
    console.log('\n📋 TEST 8: Storage and State Check');
    console.log('===================================');

    const storage = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
        cookies: document.cookie
      };
    });

    console.log('LocalStorage keys:', storage.localStorage);
    console.log('SessionStorage keys:', storage.sessionStorage);
    console.log('Cookies:', storage.cookies || 'None');

    // ========== TEST 9: SERVICE WORKER CHECK ==========
    console.log('\n📋 TEST 9: Service Worker Status');
    console.log('=================================');

    const swStatus = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return {
          supported: true,
          registrations: registrations.length,
          active: registrations.some(r => r.active),
          urls: registrations.map(r => r.scope)
        };
      }
      return { supported: false };
    });

    console.log('Service Worker Status:', swStatus);

    // ========== TEST 10: PERFORMANCE METRICS ==========
    console.log('\n📋 TEST 10: Performance Metrics');
    console.log('================================');

    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        domInteractive: perf.domInteractive,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        resources: performance.getEntriesByType('resource').length
      };
    });

    console.log('Performance Metrics:', metrics);

    // ========== FINAL DIAGNOSIS ==========
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL DIAGNOSTIC REPORT');
    console.log('='.repeat(60));

    console.log('\n🔴 CRITICAL ISSUES:');
    if (diagnostics.consoleErrors.length > 0) {
      console.log(`  - ${diagnostics.consoleErrors.length} Console Errors`);
      diagnostics.consoleErrors.slice(0, 3).forEach(e => console.log(`    • ${e}`));
    }
    if (diagnostics.networkFailures.length > 0) {
      console.log(`  - ${diagnostics.networkFailures.length} Network Failures`);
      diagnostics.networkFailures.slice(0, 3).forEach(e => console.log(`    • ${e}`));
    }
    if (diagnostics.jsExceptions.length > 0) {
      console.log(`  - ${diagnostics.jsExceptions.length} JavaScript Exceptions`);
      diagnostics.jsExceptions.slice(0, 3).forEach(e => console.log(`    • ${e}`));
    }

    console.log('\n🔍 ROOT CAUSE ANALYSIS:');

    // Determine the most likely issue
    if (isBlack && diagnostics.consoleErrors.length > 0) {
      console.log('  ❌ Black screen caused by JavaScript errors preventing React render');
    } else if (isBlack && diagnostics.networkFailures.length > 0) {
      console.log('  ❌ Black screen caused by failed asset loading');
    } else if (isBlack && !reactStatus.hasReact) {
      console.log('  ❌ React not loaded - bundle failed to execute');
    } else if (isBlack) {
      console.log('  ❌ Black screen with no obvious errors - possible CSS/styling issue');
    }

    console.log('\n💡 RECOMMENDED FIXES:');
    if (diagnostics.networkFailures.length > 0) {
      console.log('  1. Check base path configuration in vite.config.ts');
      console.log('  2. Verify GitHub Pages build uses correct PUBLIC_URL');
    }
    if (diagnostics.consoleErrors.length > 0) {
      console.log('  3. Fix JavaScript errors in production build');
      console.log('  4. Check for environment-specific code issues');
    }
    if (diagnostics.corsIssues.length > 0) {
      console.log('  5. Configure CORS headers for external resources');
    }

    // Save full diagnostic data
    await page.screenshot({
      path: 'e2e/screenshots/gh-debug-final-state.png',
      fullPage: true
    });

    console.log('\n✅ Diagnostic test complete. Check screenshots in e2e/screenshots/');
  });
});