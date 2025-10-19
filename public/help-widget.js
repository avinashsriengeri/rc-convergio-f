/**
 * RC Convergio Help Widget
 * Embeddable help center widget for external websites
 */

(function() {
  'use strict';

  // Configuration
  const DEFAULT_CONFIG = {
    tenant: null,
    modules: ['help'],
    position: 'bottom-right',
    theme: 'light',
    apiUrl: 'http://localhost:8000',
    widgetUrl: 'http://localhost:5173',
    autoOpen: false,
    showOnPages: ['*'],
    hideOnPages: [],
    customStyles: {}
  };

  // Global widget state
  let widgetConfig = {};
  let widgetInstance = null;
  let isOpen = false;
  let isLoaded = false;

  // DOM elements
  let widgetButton = null;
  let widgetContainer = null;
  let widgetIframe = null;
  let widgetOverlay = null;

  /**
   * Initialize the widget
   */
  function init() {
    // Get configuration from window.RCWidgetConfig or use defaults
    widgetConfig = Object.assign({}, DEFAULT_CONFIG, window.RCWidgetConfig || {});
    
    // Validate required configuration
    if (!widgetConfig.tenant) {
      console.error('RC Help Widget: tenant ID is required');
      return;
    }

    // Check if widget should be shown on current page
    if (!shouldShowOnCurrentPage()) {
      return;
    }

    // Create widget elements
    createWidgetElements();
    
    // Add event listeners
    addEventListeners();
    
    // Show widget button
    showWidgetButton();
    
    isLoaded = true;
    
    // Auto-open if configured
    if (widgetConfig.autoOpen) {
      setTimeout(openWidget, 1000);
    }
  }

  /**
   * Check if widget should be shown on current page
   */
  function shouldShowOnCurrentPage() {
    const currentPath = window.location.pathname;
    const showPages = widgetConfig.showOnPages;
    const hidePages = widgetConfig.hideOnPages;

    // Check hide pages first
    for (let hidePage of hidePages) {
      if (matchesPage(hidePage, currentPath)) {
        return false;
      }
    }

    // Check show pages
    for (let showPage of showPages) {
      if (matchesPage(showPage, currentPath)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a page pattern matches the current path
   */
  function matchesPage(pattern, path) {
    if (pattern === '*') return true;
    if (pattern === path) return true;
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    }
    if (pattern.startsWith('*')) {
      return path.endsWith(pattern.slice(1));
    }
    return false;
  }

  /**
   * Create widget DOM elements
   */
  function createWidgetElements() {
    // Create widget button
    widgetButton = document.createElement('div');
    widgetButton.id = 'rc-help-widget-button';
    widgetButton.innerHTML = `
      <div class="rc-widget-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span class="rc-widget-button-text">Help</span>
      </div>
    `;

    // Create widget container
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'rc-help-widget-container';
    widgetContainer.innerHTML = `
      <div class="rc-widget-header">
        <div class="rc-widget-title">Help Center</div>
        <button class="rc-widget-close" id="rc-widget-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="rc-widget-content">
        <iframe id="rc-help-widget-iframe" src="" frameborder="0"></iframe>
      </div>
    `;

    // Create overlay
    widgetOverlay = document.createElement('div');
    widgetOverlay.id = 'rc-help-widget-overlay';

    // Get iframe reference
    widgetIframe = widgetContainer.querySelector('#rc-help-widget-iframe');

    // Add elements to DOM
    document.body.appendChild(widgetButton);
    document.body.appendChild(widgetContainer);
    document.body.appendChild(widgetOverlay);
  }

  /**
   * Add event listeners
   */
  function addEventListeners() {
    // Widget button click
    widgetButton.addEventListener('click', toggleWidget);

    // Close button click
    const closeButton = widgetContainer.querySelector('#rc-widget-close');
    closeButton.addEventListener('click', closeWidget);

    // Overlay click
    widgetOverlay.addEventListener('click', closeWidget);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closeWidget();
      }
    });

    // Handle iframe messages
    window.addEventListener('message', handleIframeMessage);

    // Handle window resize
    window.addEventListener('resize', handleResize);
  }

  /**
   * Show widget button
   */
  function showWidgetButton() {
    widgetButton.style.display = 'block';
  }

  /**
   * Hide widget button
   */
  function hideWidgetButton() {
    widgetButton.style.display = 'none';
  }

  /**
   * Toggle widget open/close
   */
  function toggleWidget() {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  /**
   * Open widget
   */
  function openWidget() {
    if (isOpen) return;

    // Set iframe source
    const helpUrl = `${widgetConfig.widgetUrl}/help?tenant=${widgetConfig.tenant}&embed=true`;
    widgetIframe.src = helpUrl;

    // Show widget
    widgetContainer.style.display = 'block';
    widgetOverlay.style.display = 'block';
    
    // Add open class for animations
    setTimeout(() => {
      widgetContainer.classList.add('rc-widget-open');
      widgetOverlay.classList.add('rc-widget-overlay-open');
    }, 10);

    isOpen = true;

    // Track event
    trackEvent('widget_opened', {
      tenant: widgetConfig.tenant,
      page: window.location.href
    });
  }

  /**
   * Close widget
   */
  function closeWidget() {
    if (!isOpen) return;

    // Remove open class for animations
    widgetContainer.classList.remove('rc-widget-open');
    widgetOverlay.classList.remove('rc-widget-overlay-open');

    // Hide widget after animation
    setTimeout(() => {
      widgetContainer.style.display = 'none';
      widgetOverlay.style.display = 'none';
    }, 300);

    isOpen = false;

    // Track event
    trackEvent('widget_closed', {
      tenant: widgetConfig.tenant,
      page: window.location.href
    });
  }

  /**
   * Handle iframe messages
   */
  function handleIframeMessage(event) {
    // Verify origin for security
    if (event.origin !== widgetConfig.widgetUrl) {
      return;
    }

    const { type, data } = event.data;

    switch (type) {
      case 'widget_close':
        closeWidget();
        break;
      case 'widget_resize':
        handleWidgetResize(data);
        break;
      case 'track_event':
        trackEvent(data.event, data.properties);
        break;
    }
  }

  /**
   * Handle widget resize
   */
  function handleWidgetResize(data) {
    if (data.height) {
      widgetIframe.style.height = data.height + 'px';
    }
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (isOpen) {
      // Adjust widget position if needed
      adjustWidgetPosition();
    }
  }

  /**
   * Adjust widget position based on screen size
   */
  function adjustWidgetPosition() {
    const container = widgetContainer.querySelector('.rc-widget-content');
    const maxHeight = window.innerHeight - 100;
    const maxWidth = window.innerWidth - 100;

    if (container.offsetHeight > maxHeight) {
      container.style.maxHeight = maxHeight + 'px';
    }
    if (container.offsetWidth > maxWidth) {
      container.style.maxWidth = maxWidth + 'px';
    }
  }

  /**
   * Track events
   */
  function trackEvent(eventName, properties = {}) {
    if (!widgetConfig.tenant) return;

    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer: document.referrer
      }
    };

    // Send to tracking endpoint
    fetch(`${widgetConfig.apiUrl}/api/tracking/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tracking-Key': `tk_${widgetConfig.tenant}_help_widget`
      },
      body: JSON.stringify(eventData)
    }).catch(error => {
      console.warn('RC Help Widget: Failed to track event', error);
    });
  }

  /**
   * Public API
   */
  window.RCHelpWidget = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
    isOpen: () => isOpen,
    isLoaded: () => isLoaded,
    config: widgetConfig
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// Add CSS styles
(function() {
  const styles = `
    #rc-help-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    #rc-help-widget-button:hover {
      transform: scale(1.05);
    }

    .rc-widget-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
    }

    .rc-widget-button svg {
      width: 20px;
      height: 20px;
    }

    #rc-help-widget-container {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 400px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      display: none;
      overflow: hidden;
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      transition: all 0.3s ease;
    }

    #rc-help-widget-container.rc-widget-open {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    .rc-widget-header {
      background: #f8f9fa;
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .rc-widget-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .rc-widget-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: #666;
      transition: all 0.2s ease;
    }

    .rc-widget-close:hover {
      background: #e9ecef;
      color: #333;
    }

    .rc-widget-content {
      height: calc(100% - 60px);
      overflow: hidden;
    }

    #rc-help-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    #rc-help-widget-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9999;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    #rc-help-widget-overlay.rc-widget-overlay-open {
      opacity: 1;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      #rc-help-widget-container {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 80vh;
        border-radius: 12px 12px 0 0;
      }

      #rc-help-widget-button {
        bottom: 15px;
        right: 15px;
      }

      .rc-widget-button {
        padding: 10px 16px;
        font-size: 13px;
      }

      .rc-widget-button-text {
        display: none;
      }
    }

    /* Dark theme */
    .rc-widget-dark .rc-widget-button {
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    }

    .rc-widget-dark #rc-help-widget-container {
      background: #2d3748;
      color: white;
    }

    .rc-widget-dark .rc-widget-header {
      background: #1a202c;
      border-bottom-color: #4a5568;
    }

    .rc-widget-dark .rc-widget-title {
      color: white;
    }

    .rc-widget-dark .rc-widget-close {
      color: #a0aec0;
    }

    .rc-widget-dark .rc-widget-close:hover {
      background: #4a5568;
      color: white;
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
})();
