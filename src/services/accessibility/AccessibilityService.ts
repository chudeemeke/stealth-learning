/**
 * AAA+ Accessibility Service
 * Comprehensive accessibility features following WCAG 2.1 Level AA guidelines
 * Ensures inclusive learning for all children
 */

export interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reduceMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  cursorSize: 'normal' | 'large' | 'extra-large';
  focusIndicator: boolean;
  textSpacing: 'normal' | 'relaxed' | 'loose';

  // Audio
  screenReader: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;
  voiceGuidance: boolean;
  audioDescriptions: boolean;
  captionsEnabled: boolean;

  // Motor
  stickyKeys: boolean;
  slowKeys: boolean;
  keyRepeatDelay: number;
  dwellClicking: boolean;
  dwellDelay: number;
  simplifiedGestures: boolean;

  // Cognitive
  simplifiedUI: boolean;
  readingGuide: boolean;
  focusMode: boolean;
  distractionFree: boolean;
  extendedTimeouts: boolean;
  autoComplete: boolean;
}

interface FocusableElement {
  element: HTMLElement;
  tabIndex: number;
  role: string;
  label: string;
  description?: string;
  group?: string;
}

interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: string;
  description: string;
  context?: string;
}

export class AccessibilityService {
  private static instance: AccessibilityService;
  private settings: AccessibilitySettings;
  private focusableElements: FocusableElement[] = [];
  private currentFocusIndex: number = 0;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private announcer: HTMLElement | null = null;
  private skipLinks: HTMLElement | null = null;
  private focusTrap: HTMLElement | null = null;
  private colorFilters: Map<string, string> = new Map();
  private callbacks: Set<(settings: AccessibilitySettings) => void> = new Set();
  private keyboardNavigationEnabled: boolean = false;
  private lastAnnouncement: string = '';
  private readingGuideElement: HTMLElement | null = null;

  private readonly FOCUS_VISIBLE_CLASS = 'focus-visible';
  private readonly HIGH_CONTRAST_CLASS = 'high-contrast';
  private readonly DARK_MODE_CLASS = 'dark-mode';
  private readonly REDUCE_MOTION_CLASS = 'reduce-motion';

  private constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeColorFilters();
    this.loadSettings();
    this.initialize();
  }

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  private getDefaultSettings(): AccessibilitySettings {
    return {
      // Visual
      highContrast: false,
      darkMode: false,
      fontSize: 'medium',
      reduceMotion: false,
      colorBlindMode: 'none',
      cursorSize: 'normal',
      focusIndicator: true,
      textSpacing: 'normal',

      // Audio
      screenReader: false,
      soundEffects: true,
      backgroundMusic: true,
      voiceGuidance: false,
      audioDescriptions: false,
      captionsEnabled: false,

      // Motor
      stickyKeys: false,
      slowKeys: false,
      keyRepeatDelay: 500,
      dwellClicking: false,
      dwellDelay: 1000,
      simplifiedGestures: false,

      // Cognitive
      simplifiedUI: false,
      readingGuide: false,
      focusMode: false,
      distractionFree: false,
      extendedTimeouts: false,
      autoComplete: false
    };
  }

  /**
   * Initialize accessibility features
   */
  private initialize(): void {
    // Create screen reader announcer
    this.createScreenReaderAnnouncer();

    // Setup skip links
    this.createSkipLinks();

    // Initialize keyboard navigation
    this.setupKeyboardNavigation();

    // Setup keyboard shortcuts
    this.initializeKeyboardShortcuts();

    // Apply saved settings
    this.applySettings();

    // Check system preferences
    this.checkSystemPreferences();

    // Setup mutation observer for dynamic content
    this.observeContentChanges();

    console.log('♿ Accessibility Service initialized');
  }

  /**
   * Create screen reader announcer element
   */
  private createScreenReaderAnnouncer(): void {
    this.announcer = document.createElement('div');
    this.announcer.className = 'sr-announcer';
    this.announcer.setAttribute('role', 'status');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.announcer);
  }

  /**
   * Create skip links for keyboard navigation
   */
  private createSkipLinks(): void {
    this.skipLinks = document.createElement('nav');
    this.skipLinks.className = 'skip-links';
    this.skipLinks.setAttribute('aria-label', 'Skip links');
    this.skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#game-area" class="skip-link">Skip to game area</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#settings" class="skip-link">Skip to settings</a>
    `;
    this.skipLinks.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 100000;
      text-decoration: none;
    `;

    // Show on focus
    this.skipLinks.querySelectorAll('.skip-link').forEach(link => {
      link.addEventListener('focus', () => {
        this.skipLinks!.style.top = '0';
      });
      link.addEventListener('blur', () => {
        this.skipLinks!.style.top = '-40px';
      });
    });

    document.body.insertBefore(this.skipLinks, document.body.firstChild);
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Track focus changes
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Add focus visible polyfill
    this.setupFocusVisible();
  }

  /**
   * Initialize keyboard shortcuts
   */
  private initializeKeyboardShortcuts(): void {
    // Navigation shortcuts
    this.addShortcut({
      key: 'Tab',
      action: 'next_element',
      description: 'Navigate to next element'
    });

    this.addShortcut({
      key: 'Tab',
      modifiers: ['shift'],
      action: 'previous_element',
      description: 'Navigate to previous element'
    });

    this.addShortcut({
      key: 'Enter',
      action: 'activate',
      description: 'Activate current element'
    });

    this.addShortcut({
      key: ' ',
      action: 'activate',
      description: 'Activate current element'
    });

    this.addShortcut({
      key: 'Escape',
      action: 'close_modal',
      description: 'Close current modal or popup'
    });

    // Game shortcuts
    this.addShortcut({
      key: '1',
      action: 'select_option_1',
      description: 'Select first option',
      context: 'game'
    });

    this.addShortcut({
      key: '2',
      action: 'select_option_2',
      description: 'Select second option',
      context: 'game'
    });

    this.addShortcut({
      key: '3',
      action: 'select_option_3',
      description: 'Select third option',
      context: 'game'
    });

    this.addShortcut({
      key: '4',
      action: 'select_option_4',
      description: 'Select fourth option',
      context: 'game'
    });

    this.addShortcut({
      key: 'ArrowLeft',
      action: 'navigate_left',
      description: 'Navigate left'
    });

    this.addShortcut({
      key: 'ArrowRight',
      action: 'navigate_right',
      description: 'Navigate right'
    });

    this.addShortcut({
      key: 'ArrowUp',
      action: 'navigate_up',
      description: 'Navigate up'
    });

    this.addShortcut({
      key: 'ArrowDown',
      action: 'navigate_down',
      description: 'Navigate down'
    });

    // Accessibility shortcuts
    this.addShortcut({
      key: 'h',
      modifiers: ['alt'],
      action: 'toggle_high_contrast',
      description: 'Toggle high contrast mode'
    });

    this.addShortcut({
      key: 'd',
      modifiers: ['alt'],
      action: 'toggle_dark_mode',
      description: 'Toggle dark mode'
    });

    this.addShortcut({
      key: '+',
      modifiers: ['ctrl'],
      action: 'increase_font_size',
      description: 'Increase font size'
    });

    this.addShortcut({
      key: '-',
      modifiers: ['ctrl'],
      action: 'decrease_font_size',
      description: 'Decrease font size'
    });

    this.addShortcut({
      key: '0',
      modifiers: ['ctrl'],
      action: 'reset_font_size',
      description: 'Reset font size'
    });

    this.addShortcut({
      key: '/',
      modifiers: ['ctrl'],
      action: 'show_shortcuts',
      description: 'Show keyboard shortcuts'
    });
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Check for shortcuts
    const shortcut = this.matchShortcut(event);
    if (shortcut) {
      event.preventDefault();
      this.executeShortcut(shortcut);
      return;
    }

    // Handle sticky keys
    if (this.settings.stickyKeys) {
      this.handleStickyKeys(event);
    }

    // Handle slow keys
    if (this.settings.slowKeys) {
      this.handleSlowKeys(event);
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    // Handle sticky keys release
    if (this.settings.stickyKeys) {
      // Implementation for sticky keys
    }
  }

  /**
   * Handle focus in events
   */
  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;

    // Announce element to screen reader
    if (this.settings.screenReader) {
      this.announceElement(target);
    }

    // Update current focus index
    const index = this.focusableElements.findIndex(el => el.element === target);
    if (index >= 0) {
      this.currentFocusIndex = index;
    }

    // Show focus indicator
    if (this.settings.focusIndicator) {
      target.classList.add(this.FOCUS_VISIBLE_CLASS);
    }
  }

  /**
   * Handle focus out events
   */
  private handleFocusOut(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    target.classList.remove(this.FOCUS_VISIBLE_CLASS);
  }

  /**
   * Setup focus visible polyfill
   */
  private setupFocusVisible(): void {
    // Track keyboard vs mouse navigation
    let hadKeyboardEvent = false;

    const onPointerDown = () => {
      hadKeyboardEvent = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        hadKeyboardEvent = true;
      }
    };

    const onFocus = (e: FocusEvent) => {
      if (hadKeyboardEvent || (e.target as HTMLElement).matches(':focus-visible')) {
        (e.target as HTMLElement).classList.add(this.FOCUS_VISIBLE_CLASS);
      }
    };

    const onBlur = (e: FocusEvent) => {
      (e.target as HTMLElement).classList.remove(this.FOCUS_VISIBLE_CLASS);
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
  }

  /**
   * Match keyboard shortcut
   */
  private matchShortcut(event: KeyboardEvent): KeyboardShortcut | null {
    for (const shortcut of this.shortcuts.values()) {
      if (shortcut.key !== event.key) continue;

      const modifiersMatch =
        (!shortcut.modifiers || shortcut.modifiers.length === 0) ||
        (shortcut.modifiers.every(mod => {
          switch (mod) {
            case 'ctrl': return event.ctrlKey;
            case 'alt': return event.altKey;
            case 'shift': return event.shiftKey;
            case 'meta': return event.metaKey;
            default: return false;
          }
        }) &&
        // Check that no extra modifiers are pressed
        shortcut.modifiers.length ===
          (event.ctrlKey ? 1 : 0) +
          (event.altKey ? 1 : 0) +
          (event.shiftKey ? 1 : 0) +
          (event.metaKey ? 1 : 0));

      if (modifiersMatch) {
        return shortcut;
      }
    }

    return null;
  }

  /**
   * Execute keyboard shortcut
   */
  private executeShortcut(shortcut: KeyboardShortcut): void {
    console.log(`⌨️ Executing shortcut: ${shortcut.action}`);

    // Announce action to screen reader
    if (this.settings.screenReader) {
      this.announce(shortcut.description);
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('keyboard-shortcut', {
      detail: { action: shortcut.action, shortcut }
    }));

    // Handle built-in actions
    switch (shortcut.action) {
      case 'toggle_high_contrast':
        this.toggleHighContrast();
        break;
      case 'toggle_dark_mode':
        this.toggleDarkMode();
        break;
      case 'increase_font_size':
        this.adjustFontSize(1);
        break;
      case 'decrease_font_size':
        this.adjustFontSize(-1);
        break;
      case 'reset_font_size':
        this.resetFontSize();
        break;
      case 'show_shortcuts':
        this.showKeyboardShortcuts();
        break;
    }
  }

  /**
   * Handle sticky keys
   */
  private handleStickyKeys(event: KeyboardEvent): void {
    // Implementation for sticky keys functionality
    // This allows modifiers to be pressed sequentially instead of simultaneously
  }

  /**
   * Handle slow keys
   */
  private handleSlowKeys(event: KeyboardEvent): void {
    // Implementation for slow keys functionality
    // This adds a delay before key press is registered
  }

  /**
   * Initialize color filters for color blind modes
   */
  private initializeColorFilters(): void {
    // SVG filters for different types of color blindness
    this.colorFilters.set('protanopia', `
      <filter id="protanopia">
        <feColorMatrix values="0.567, 0.433, 0, 0, 0
                               0.558, 0.442, 0, 0, 0
                               0, 0.242, 0.758, 0, 0
                               0, 0, 0, 1, 0"/>
      </filter>
    `);

    this.colorFilters.set('deuteranopia', `
      <filter id="deuteranopia">
        <feColorMatrix values="0.625, 0.375, 0, 0, 0
                               0.7, 0.3, 0, 0, 0
                               0, 0.3, 0.7, 0, 0
                               0, 0, 0, 1, 0"/>
      </filter>
    `);

    this.colorFilters.set('tritanopia', `
      <filter id="tritanopia">
        <feColorMatrix values="0.95, 0.05, 0, 0, 0
                               0, 0.433, 0.567, 0, 0
                               0, 0.475, 0.525, 0, 0
                               0, 0, 0, 1, 0"/>
      </filter>
    `);

    this.colorFilters.set('achromatopsia', `
      <filter id="achromatopsia">
        <feColorMatrix values="0.299, 0.587, 0.114, 0, 0
                               0.299, 0.587, 0.114, 0, 0
                               0.299, 0.587, 0.114, 0, 0
                               0, 0, 0, 1, 0"/>
      </filter>
    `);
  }

  /**
   * Check system preferences
   */
  private checkSystemPreferences(): void {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.settings.reduceMotion = true;
    }

    // Check prefers-color-scheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.settings.darkMode = true;
    }

    // Check prefers-contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.settings.highContrast = true;
    }
  }

  /**
   * Observe content changes for dynamic accessibility
   */
  private observeContentChanges(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          // Update focusable elements
          this.updateFocusableElements();

          // Announce changes to screen reader
          if (this.settings.screenReader && mutation.addedNodes.length > 0) {
            const addedText = Array.from(mutation.addedNodes)
              .filter(node => node.nodeType === Node.ELEMENT_NODE)
              .map(node => (node as HTMLElement).textContent)
              .join(' ');

            if (addedText.trim()) {
              this.announce(`New content: ${addedText.substring(0, 100)}`);
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Update focusable elements list
   */
  private updateFocusableElements(): void {
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const elements = document.querySelectorAll(selector);

    this.focusableElements = Array.from(elements).map(el => {
      const element = el as HTMLElement;
      return {
        element,
        tabIndex: parseInt(element.getAttribute('tabindex') || '0'),
        role: element.getAttribute('role') || element.tagName.toLowerCase(),
        label: this.getElementLabel(element),
        description: element.getAttribute('aria-describedby') || undefined,
        group: element.closest('[role="group"]')?.getAttribute('aria-label') || undefined
      };
    });

    // Sort by tab index
    this.focusableElements.sort((a, b) => {
      if (a.tabIndex === b.tabIndex) return 0;
      if (a.tabIndex === 0) return 1;
      if (b.tabIndex === 0) return -1;
      return a.tabIndex - b.tabIndex;
    });
  }

  /**
   * Get element label for screen reader
   */
  private getElementLabel(element: HTMLElement): string {
    // Check aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) return labelElement.textContent || '';
    }

    // Check for associated label
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      const id = element.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) return label.textContent || '';
      }
    }

    // Use text content
    return element.textContent?.trim() || element.getAttribute('title') || '';
  }

  /**
   * Announce to screen reader
   */
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) return;

    // Avoid duplicate announcements
    if (message === this.lastAnnouncement) {
      message += ' '; // Add space to force re-announcement
    }

    this.lastAnnouncement = message;
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }

  /**
   * Announce element details
   */
  private announceElement(element: HTMLElement): void {
    const focusable = this.focusableElements.find(el => el.element === element);
    if (!focusable) return;

    let announcement = focusable.label;

    // Add role information
    if (focusable.role) {
      announcement += `, ${focusable.role}`;
    }

    // Add state information
    if (element.getAttribute('aria-checked')) {
      announcement += `, ${element.getAttribute('aria-checked') === 'true' ? 'checked' : 'unchecked'}`;
    }

    if (element.getAttribute('aria-expanded')) {
      announcement += `, ${element.getAttribute('aria-expanded') === 'true' ? 'expanded' : 'collapsed'}`;
    }

    if (element.getAttribute('aria-selected')) {
      announcement += `, ${element.getAttribute('aria-selected') === 'true' ? 'selected' : 'not selected'}`;
    }

    // Add description
    if (focusable.description) {
      const descElement = document.getElementById(focusable.description);
      if (descElement) {
        announcement += `, ${descElement.textContent}`;
      }
    }

    // Add group context
    if (focusable.group) {
      announcement += `, in ${focusable.group}`;
    }

    this.announce(announcement);
  }

  /**
   * Toggle high contrast mode
   */
  public toggleHighContrast(): void {
    this.settings.highContrast = !this.settings.highContrast;
    this.applyHighContrast();
    this.saveSettings();
    this.announce(`High contrast ${this.settings.highContrast ? 'enabled' : 'disabled'}`);
  }

  /**
   * Toggle dark mode
   */
  public toggleDarkMode(): void {
    this.settings.darkMode = !this.settings.darkMode;
    this.applyDarkMode();
    this.saveSettings();
    this.announce(`Dark mode ${this.settings.darkMode ? 'enabled' : 'disabled'}`);
  }

  /**
   * Adjust font size
   */
  public adjustFontSize(delta: number): void {
    const sizes: AccessibilitySettings['fontSize'][] = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(this.settings.fontSize);
    const newIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + delta));

    this.settings.fontSize = sizes[newIndex];
    this.applyFontSize();
    this.saveSettings();
    this.announce(`Font size ${this.settings.fontSize}`);
  }

  /**
   * Reset font size
   */
  public resetFontSize(): void {
    this.settings.fontSize = 'medium';
    this.applyFontSize();
    this.saveSettings();
    this.announce('Font size reset to medium');
  }

  /**
   * Apply settings
   */
  private applySettings(): void {
    this.applyHighContrast();
    this.applyDarkMode();
    this.applyFontSize();
    this.applyReduceMotion();
    this.applyColorBlindMode();
    this.applyTextSpacing();
    this.applyCursorSize();
  }

  /**
   * Apply high contrast
   */
  private applyHighContrast(): void {
    document.body.classList.toggle(this.HIGH_CONTRAST_CLASS, this.settings.highContrast);

    if (this.settings.highContrast) {
      document.documentElement.style.setProperty('--contrast-ratio', '7');
    } else {
      document.documentElement.style.setProperty('--contrast-ratio', '4.5');
    }
  }

  /**
   * Apply dark mode
   */
  private applyDarkMode(): void {
    document.body.classList.toggle(this.DARK_MODE_CLASS, this.settings.darkMode);
  }

  /**
   * Apply font size
   */
  private applyFontSize(): void {
    const sizes = {
      'small': '14px',
      'medium': '16px',
      'large': '20px',
      'extra-large': '24px'
    };

    document.documentElement.style.setProperty('--base-font-size', sizes[this.settings.fontSize]);
  }

  /**
   * Apply reduce motion
   */
  private applyReduceMotion(): void {
    document.body.classList.toggle(this.REDUCE_MOTION_CLASS, this.settings.reduceMotion);

    if (this.settings.reduceMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '300ms');
      document.documentElement.style.setProperty('--transition-duration', '200ms');
    }
  }

  /**
   * Apply color blind mode
   */
  private applyColorBlindMode(): void {
    // Remove existing filter
    const existingFilter = document.getElementById('color-blind-filter');
    if (existingFilter) {
      existingFilter.remove();
    }

    if (this.settings.colorBlindMode !== 'none') {
      // Add SVG filter
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'color-blind-filter';
      svg.style.display = 'none';
      svg.innerHTML = this.colorFilters.get(this.settings.colorBlindMode) || '';
      document.body.appendChild(svg);

      // Apply filter to body
      document.body.style.filter = `url(#${this.settings.colorBlindMode})`;
    } else {
      document.body.style.filter = '';
    }
  }

  /**
   * Apply text spacing
   */
  private applyTextSpacing(): void {
    const spacings = {
      'normal': {
        letterSpacing: 'normal',
        wordSpacing: 'normal',
        lineHeight: '1.5'
      },
      'relaxed': {
        letterSpacing: '0.12em',
        wordSpacing: '0.16em',
        lineHeight: '1.8'
      },
      'loose': {
        letterSpacing: '0.2em',
        wordSpacing: '0.25em',
        lineHeight: '2'
      }
    };

    const spacing = spacings[this.settings.textSpacing];
    document.documentElement.style.setProperty('--letter-spacing', spacing.letterSpacing);
    document.documentElement.style.setProperty('--word-spacing', spacing.wordSpacing);
    document.documentElement.style.setProperty('--line-height', spacing.lineHeight);
  }

  /**
   * Apply cursor size
   */
  private applyCursorSize(): void {
    const sizes = {
      'normal': 'auto',
      'large': 'url("data:image/svg+xml,...") 16 16, auto',
      'extra-large': 'url("data:image/svg+xml,...") 24 24, auto'
    };

    document.body.style.cursor = sizes[this.settings.cursorSize];
  }

  /**
   * Show keyboard shortcuts dialog
   */
  private showKeyboardShortcuts(): void {
    // Create shortcuts dialog
    const dialog = document.createElement('div');
    dialog.className = 'keyboard-shortcuts-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-label', 'Keyboard shortcuts');

    const content = Array.from(this.shortcuts.values())
      .map(shortcut => {
        const keys = shortcut.modifiers ?
          [...shortcut.modifiers, shortcut.key].join('+') :
          shortcut.key;
        return `<tr><td>${keys}</td><td>${shortcut.description}</td></tr>`;
      })
      .join('');

    dialog.innerHTML = `
      <div class="dialog-content">
        <h2>Keyboard Shortcuts</h2>
        <table>
          <thead>
            <tr><th>Keys</th><th>Action</th></tr>
          </thead>
          <tbody>${content}</tbody>
        </table>
        <button class="close-button">Close (ESC)</button>
      </div>
    `;

    // Style the dialog
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid black;
      padding: 20px;
      z-index: 100000;
      max-height: 80vh;
      overflow-y: auto;
    `;

    document.body.appendChild(dialog);

    // Focus trap
    this.createFocusTrap(dialog);

    // Close on ESC or button click
    const closeHandler = () => {
      dialog.remove();
      this.removeFocusTrap();
    };

    dialog.querySelector('.close-button')?.addEventListener('click', closeHandler);

    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeHandler();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Create focus trap
   */
  private createFocusTrap(container: HTMLElement): void {
    this.focusTrap = container;
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstElement.focus();

    // Trap focus
    const trapHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', trapHandler);

    // Store handler for cleanup
    (container as any).__trapHandler = trapHandler;
  }

  /**
   * Remove focus trap
   */
  private removeFocusTrap(): void {
    if (!this.focusTrap) return;

    const handler = (this.focusTrap as any).__trapHandler;
    if (handler) {
      document.removeEventListener('keydown', handler);
    }

    this.focusTrap = null;
  }

  /**
   * Add keyboard shortcut
   */
  public addShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Get shortcut key
   */
  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const modifiers = shortcut.modifiers?.sort().join('+') || '';
    return modifiers ? `${modifiers}+${shortcut.key}` : shortcut.key;
  }

  /**
   * Update settings
   */
  public updateSettings(settings: Partial<AccessibilitySettings>): void {
    Object.assign(this.settings, settings);
    this.applySettings();
    this.saveSettings();

    // Notify listeners
    this.callbacks.forEach(callback => callback(this.settings));
  }

  /**
   * Get settings
   */
  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Save settings
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }

  /**
   * Load settings
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('accessibility_settings');
      if (stored) {
        Object.assign(this.settings, JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  }

  /**
   * Subscribe to settings changes
   */
  public onSettingsChange(callback: (settings: AccessibilitySettings) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Navigate to next focusable element
   */
  public focusNext(): void {
    this.updateFocusableElements();
    if (this.focusableElements.length === 0) return;

    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentFocusIndex].element.focus();
  }

  /**
   * Navigate to previous focusable element
   */
  public focusPrevious(): void {
    this.updateFocusableElements();
    if (this.focusableElements.length === 0) return;

    this.currentFocusIndex = (this.currentFocusIndex - 1 + this.focusableElements.length) % this.focusableElements.length;
    this.focusableElements[this.currentFocusIndex].element.focus();
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    if (this.announcer) {
      this.announcer.remove();
    }
    if (this.skipLinks) {
      this.skipLinks.remove();
    }
    this.removeFocusTrap();
    this.callbacks.clear();
  }
}

// Export singleton instance
export const accessibilityService = AccessibilityService.getInstance();