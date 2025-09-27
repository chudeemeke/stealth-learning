import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Localhost Game Flow Testing
 * Identifies and debugs navigation issues where games don't start properly
 */

interface NavigationState {
  url: string;
  pageTitle: string;
  visibleElements: {
    buttons: string[];
    headings: string[];
    inputs: number;
  };
  consoleErrors: string[];
  networkErrors: string[];
}

class GameFlowDebugger {
  private page: Page;
  private navigationHistory: NavigationState[] = [];
  private stateSnapshots: any[] = [];
  private issuesFound: string[] = [];

  constructor(page: Page) {
    this.page = page;
    this.setupMonitoring();
  }

  /**
   * Set up comprehensive monitoring
   */
  private setupMonitoring() {
    // Monitor console for errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        console.log('❌ Console Error:', text);
        this.issuesFound.push(`Console Error: ${text}`);
      }
    });

    // Monitor navigation
    this.page.on('framenavigated', frame => {
      if (frame === this.page.mainFrame()) {
        console.log('📍 Navigated to:', frame.url());
      }
    });

    // Monitor network failures
    this.page.on('requestfailed', request => {
      const failure = `${request.url()} - ${request.failure()?.errorText}`;
      console.log('🔴 Request Failed:', failure);
      this.issuesFound.push(`Network Error: ${failure}`);
    });

    // Monitor page errors
    this.page.on('pageerror', error => {
      console.log('💥 Page Error:', error.message);
      this.issuesFound.push(`Page Error: ${error.message}`);
    });
  }

  /**
   * Capture current page state
   */
  async captureState(label: string): Promise<NavigationState> {
    console.log(`\n📸 Capturing state: ${label}`);

    // Get all button texts
    const buttons = await this.page.locator('button').all();
    const buttonTexts = await Promise.all(buttons.map(async b => {
      const text = await b.textContent();
      const isVisible = await b.isVisible();
      return isVisible ? text?.trim() || '' : '';
    }));

    // Get all headings
    const headings = await this.page.locator('h1, h2, h3').all();
    const headingTexts = await Promise.all(headings.map(async h => {
      const text = await h.textContent();
      return text?.trim() || '';
    }));

    // Count inputs
    const inputCount = await this.page.locator('input').count();

    const state: NavigationState = {
      url: this.page.url(),
      pageTitle: await this.page.title(),
      visibleElements: {
        buttons: buttonTexts.filter(t => t),
        headings: headingTexts.filter(t => t),
        inputs: inputCount
      },
      consoleErrors: [],
      networkErrors: []
    };

    this.navigationHistory.push(state);

    // Log state
    console.log(`  URL: ${state.url}`);
    console.log(`  Buttons: [${state.visibleElements.buttons.join(', ')}]`);
    console.log(`  Headings: [${state.visibleElements.headings.join(', ')}]`);

    // Take screenshot
    await this.page.screenshot({
      path: `e2e/screenshots/localhost-${label.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: true
    });

    return state;
  }

  /**
   * Test game selection and start flow
   */
  async testGameStartFlow(): Promise<boolean> {
    console.log('\n🎮 Testing Game Start Flow...');

    // Find game selection buttons
    const gameButtons = await this.page.locator('button').filter({
      has: this.page.locator('text=/play|start|game|math|english|science/i')
    }).all();

    if (gameButtons.length === 0) {
      console.log('❌ No game buttons found');
      this.issuesFound.push('No game selection buttons found');
      return false;
    }

    console.log(`Found ${gameButtons.length} potential game buttons`);

    // Try clicking the first game button
    const firstGameButton = gameButtons[0];
    const buttonText = await firstGameButton.textContent();
    console.log(`\n🖱️ Clicking button: "${buttonText}"`);

    // Capture state before click
    const beforeState = await this.captureState('before-game-click');

    // Click the button
    await firstGameButton.click();

    // Wait for potential navigation or state change
    await this.page.waitForTimeout(3000);

    // Capture state after click
    const afterState = await this.captureState('after-game-click');

    // Analyze what happened
    const urlChanged = beforeState.url !== afterState.url;
    const contentChanged =
      JSON.stringify(beforeState.visibleElements) !== JSON.stringify(afterState.visibleElements);

    console.log('\n📊 Click Analysis:');
    console.log(`  URL changed: ${urlChanged ? '✅' : '❌'}`);
    console.log(`  Content changed: ${contentChanged ? '✅' : '❌'}`);

    if (!urlChanged && !contentChanged) {
      console.log('  ⚠️ WARNING: No navigation or content change detected!');
      this.issuesFound.push('Game button click did not trigger navigation or content change');

      // Check if we're back at the loading screen
      const hasLoadingIndicator = await this.page.locator('text=/loading/i').count() > 0;
      const hasStartButton = await this.page.locator('button:has-text("Start Playing")').count() > 0;

      if (hasLoadingIndicator || hasStartButton) {
        console.log('  ❌ ISSUE CONFIRMED: Returned to loading/start screen instead of game!');
        this.issuesFound.push('Game selection returns to loading screen instead of starting game');
        return false;
      }
    }

    return urlChanged || contentChanged;
  }

  /**
   * Check Redux/state management
   */
  async checkStateManagement(): Promise<void> {
    console.log('\n🔍 Checking State Management...');

    const reduxState = await this.page.evaluate(() => {
      // Try to access Redux store if available
      const store = (window as any).__REDUX_STORE__ ||
                    (window as any).store ||
                    document.querySelector('#root')?._reactRootContainer?._internalRoot?.pendingProps?.store;

      if (store && typeof store.getState === 'function') {
        return store.getState();
      }

      // Try React DevTools
      const reactDevTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (reactDevTools) {
        return { hasReactDevTools: true };
      }

      return null;
    });

    if (reduxState) {
      console.log('  ✅ Redux state found:', JSON.stringify(reduxState, null, 2).substring(0, 500));
      this.stateSnapshots.push(reduxState);
    } else {
      console.log('  ⚠️ Could not access Redux state');
    }

    // Check localStorage
    const localStorage = await this.page.evaluate(() => {
      return Object.fromEntries(
        Object.keys(window.localStorage).map(key => [key, window.localStorage.getItem(key)])
      );
    });

    if (Object.keys(localStorage).length > 0) {
      console.log('  📦 LocalStorage:', Object.keys(localStorage));
    }

    // Check sessionStorage
    const sessionStorage = await this.page.evaluate(() => {
      return Object.fromEntries(
        Object.keys(window.sessionStorage).map(key => [key, window.sessionStorage.getItem(key)])
      );
    });

    if (Object.keys(sessionStorage).length > 0) {
      console.log('  📦 SessionStorage:', Object.keys(sessionStorage));
    }
  }

  /**
   * Test routing system
   */
  async testRouting(): Promise<void> {
    console.log('\n🛣️ Testing Routing System...');

    // Check current route
    const currentPath = new URL(this.page.url()).pathname;
    const currentHash = new URL(this.page.url()).hash;

    console.log(`  Current path: ${currentPath}`);
    console.log(`  Current hash: ${currentHash}`);

    // Try programmatic navigation
    const canNavigate = await this.page.evaluate(() => {
      // Check for React Router
      const hasReactRouter = !!(window as any).ReactRouter ||
                            !!(window as any).__REACT_ROUTER__;

      // Check for history API
      const hasHistory = !!(window as any).history &&
                        typeof (window as any).history.pushState === 'function';

      return {
        hasReactRouter,
        hasHistory,
        pathname: window.location.pathname,
        hash: window.location.hash,
        search: window.location.search
      };
    });

    console.log('  Router check:', canNavigate);

    // Try to navigate to game routes directly
    const gameRoutes = [
      '/play',
      '/play/mathematics',
      '/play/english',
      '/game',
      '/games',
      '#/play',
      '#/games'
    ];

    for (const route of gameRoutes) {
      console.log(`\n  Testing route: ${route}`);

      try {
        await this.page.goto(`http://localhost:3001${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: 5000
        });

        await this.page.waitForTimeout(1000);

        const hasContent = await this.page.locator('button, h1, h2').count() > 0;
        const currentUrl = this.page.url();

        console.log(`    Result: ${hasContent ? '✅ Has content' : '❌ No content'}`);
        console.log(`    Final URL: ${currentUrl}`);

        if (hasContent) {
          await this.captureState(`route-${route.replace(/\//g, '-')}`);
          break; // Found working route
        }
      } catch (error) {
        console.log(`    ❌ Route failed: ${error}`);
      }
    }
  }

  /**
   * Check for common React/routing issues
   */
  async diagnoseIssues(): Promise<void> {
    console.log('\n🔧 Diagnosing Common Issues...');

    // Check for infinite loops
    const performanceEntries = await this.page.evaluate(() => {
      return performance.getEntriesByType('navigation');
    });

    console.log('  Navigation performance:', performanceEntries);

    // Check for React Strict Mode double-rendering
    const hasStrictMode = await this.page.evaluate(() => {
      return document.documentElement.innerHTML.includes('StrictMode');
    });

    if (hasStrictMode) {
      console.log('  ⚠️ React StrictMode detected (may cause double renders)');
    }

    // Check for missing event handlers
    const buttonsWithoutHandlers = await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => {
        // Check if button has click handlers
        const hasOnClick = btn.onclick !== null;
        const hasEventListeners = (btn as any)._eventListeners?.click?.length > 0;
        const hasReactHandler = Object.keys(btn).some(key => key.startsWith('__reactEventHandlers'));

        return !hasOnClick && !hasEventListeners && !hasReactHandler;
      }).map(btn => btn.textContent);
    });

    if (buttonsWithoutHandlers.length > 0) {
      console.log('  ⚠️ Buttons without click handlers:', buttonsWithoutHandlers);
      this.issuesFound.push(`Buttons without handlers: ${buttonsWithoutHandlers.join(', ')}`);
    }
  }

  /**
   * Generate diagnostic report
   */
  generateReport(): string {
    let report = '\n' + '='.repeat(60) + '\n';
    report += '🔍 GAME FLOW DIAGNOSTIC REPORT\n';
    report += '='.repeat(60) + '\n\n';

    report += '📍 NAVIGATION HISTORY:\n';
    this.navigationHistory.forEach((state, index) => {
      report += `  ${index + 1}. ${state.url}\n`;
      report += `     Buttons: [${state.visibleElements.buttons.slice(0, 3).join(', ')}]\n`;
    });

    if (this.issuesFound.length > 0) {
      report += '\n❌ ISSUES FOUND:\n';
      this.issuesFound.forEach(issue => {
        report += `  - ${issue}\n`;
      });
    }

    report += '\n💡 LIKELY CAUSES:\n';

    if (this.issuesFound.some(i => i.includes('returns to loading'))) {
      report += '  1. Router not configured for game routes\n';
      report += '  2. State not persisting game selection\n';
      report += '  3. Component unmounting and remounting\n';
      report += '  4. Missing route handlers for /play/* paths\n';
    }

    if (this.issuesFound.some(i => i.includes('without handlers'))) {
      report += '  5. Event handlers not properly attached\n';
      report += '  6. React re-rendering removing handlers\n';
    }

    return report;
  }
}

test.describe('🎮 Localhost Game Flow Testing', () => {
  test('Complete game selection and start flow', async ({ page }) => {
    const flowDebugger = new GameFlowDebugger(page);

    console.log('🚀 Starting Localhost Game Flow Test\n');
    console.log('=' + '='.repeat(60));

    // STEP 1: Navigate to localhost
    console.log('\n📡 Loading localhost...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for app to fully load
    await page.waitForTimeout(3000);

    // STEP 2: Capture initial state
    await flowDebugger.captureState('initial-load');

    // STEP 3: Check if we need to get past loading screen
    const loadingIndicator = page.locator('text=/loading/i, .loading, [class*="load"]').first();
    if (await loadingIndicator.count() > 0) {
      console.log('\n⏳ Waiting for loading to complete...');

      try {
        await loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
        console.log('✅ Loading complete');
      } catch {
        console.log('⚠️ Loading indicator still visible after 10s');
      }

      await flowDebugger.captureState('after-loading');
    }

    // STEP 4: Navigate through initial screens
    console.log('\n🎯 Navigating to game selection...');

    // Try clicking "Play Games" or similar button
    const playButton = page.locator('button').filter({
      hasText: /play|start|begin|kid|game/i
    }).first();

    if (await playButton.count() > 0) {
      const buttonText = await playButton.textContent();
      console.log(`Clicking: "${buttonText}"`);

      await playButton.click();
      await page.waitForTimeout(2000);
      await flowDebugger.captureState('after-play-click');
    }

    // STEP 5: Try to enter kid flow
    const kidNameInput = page.locator('input[type="text"], input[placeholder*="name"]').first();
    if (await kidNameInput.count() > 0) {
      console.log('\n📝 Filling kid name...');
      await kidNameInput.fill('TestKid');

      const continueButton = page.locator('button').filter({
        hasText: /continue|next|done|play/i
      }).first();

      if (await continueButton.count() > 0) {
        await continueButton.click();
        await page.waitForTimeout(2000);
        await flowDebugger.captureState('after-name-entry');
      }
    }

    // STEP 6: Select age if needed
    const ageButton = page.locator('button').filter({
      hasText: /6-8|years/i
    }).first();

    if (await ageButton.count() > 0) {
      console.log('\n🎂 Selecting age group...');
      await ageButton.click();
      await page.waitForTimeout(2000);
      await flowDebugger.captureState('after-age-selection');
    }

    // STEP 7: Look for game selection screen
    console.log('\n🎮 Looking for game selection screen...');

    // Check for subject cards or game tiles
    const gameCards = await page.locator('[class*="card"], [class*="game"], [class*="subject"]').all();
    console.log(`Found ${gameCards.length} potential game cards`);

    if (gameCards.length > 0) {
      await flowDebugger.captureState('game-selection-screen');

      // Try clicking on a specific subject/game
      const mathCard = page.locator('*').filter({
        hasText: /math|numbers|counting/i
      }).locator('button').first();

      if (await mathCard.count() > 0) {
        console.log('\n🔢 Clicking Mathematics game...');
        const beforeUrl = page.url();

        await mathCard.click();
        await page.waitForTimeout(3000);

        const afterUrl = page.url();
        await flowDebugger.captureState('after-math-click');

        // CHECK: Did we actually navigate to the game?
        if (beforeUrl === afterUrl) {
          console.log('❌ URL did not change after clicking game!');

          // Check if we're back at start
          const backAtStart = await page.locator('button:has-text("Start Playing")').count() > 0;
          if (backAtStart) {
            console.log('❌ CONFIRMED: Returned to start screen instead of game!');
          }
        } else {
          console.log('✅ Navigated to:', afterUrl);
        }
      }
    }

    // STEP 8: Test direct game button clicks
    const success = await flowDebugger.testGameStartFlow();

    // STEP 9: Additional diagnostics
    await flowDebugger.checkStateManagement();
    await flowDebugger.testRouting();
    await flowDebugger.diagnoseIssues();

    // STEP 10: Generate report
    const report = flowDebugger.generateReport();
    console.log(report);

    // Assertions
    expect(success, 'Game should start when clicked').toBe(true);

    const issues = flowDebugger['issuesFound'];
    expect(issues.filter(i => i.includes('returns to loading')).length,
           'Should not return to loading screen').toBe(0);
  });

  test('Direct game route navigation', async ({ page }) => {
    console.log('\n🛣️ Testing Direct Game Routes...\n');

    const routes = [
      { path: '/', name: 'Home' },
      { path: '/play', name: 'Play' },
      { path: '/play/mathematics', name: 'Mathematics Game' },
      { path: '/play/english', name: 'English Game' },
      { path: '/games', name: 'Games List' },
      { path: '/profile', name: 'Profile' }
    ];

    for (const route of routes) {
      console.log(`\nTesting: ${route.name} (${route.path})`);

      try {
        await page.goto(`http://localhost:3001${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 10000
        });

        await page.waitForTimeout(2000);

        // Check what loaded
        const hasButtons = await page.locator('button').count();
        const hasHeadings = await page.locator('h1, h2, h3').count();
        const pageText = await page.locator('body').textContent();

        console.log(`  Buttons: ${hasButtons}`);
        console.log(`  Headings: ${hasHeadings}`);
        console.log(`  Text length: ${pageText?.length || 0}`);

        // Take screenshot
        await page.screenshot({
          path: `e2e/screenshots/route-${route.path.replace(/\//g, '-') || 'root'}.png`,
          fullPage: true
        });

        // Check for loading loop
        const isLoading = await page.locator('text=/loading/i').count() > 0;
        if (isLoading) {
          console.log(`  ⚠️ Still showing loading screen`);
        }

      } catch (error) {
        console.log(`  ❌ Failed to load: ${error}`);
      }
    }
  });
});