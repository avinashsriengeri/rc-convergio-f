/**
 * RC Tracking Snippet - Client-Side Tracking Library
 * Version: 1.0.0
 * Compatible: ES5, Vanilla JavaScript, No build tools required
 */

(function(window, document) {
    'use strict';

    // Global RC object
    window.RC = window.RC || {};

    // Configuration
    var config = {
        tenantId: null,
        trackingKey: null,
        apiEndpoint: '/api/tracking/events',
        cookieName: 'rc_vid',
        cookieExpiry: 365, // days
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        debounceDelay: 250, // ms
        maxEventsPerSecond: 2,
        retryMax: 3,
        retryDelay: 1000 // ms
    };

    // State management
    var state = {
        visitorId: null,
        sessionId: null,
        lastActivity: null,
        eventQueue: [],
        isPolling: false,
        retryCount: 0
    };

    // Utility functions
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
        return null;
    }

    function setCookie(name, value, days) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
    }

    function getTimestamp() {
        var now = new Date();
        return {
            utc: now.toISOString(),
            local_offset: now.getTimezoneOffset()
        };
    }

    function getViewport() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    }

    function getUserAgent() {
        return navigator.userAgent || '';
    }

    function getCurrentPageUrl() {
        return window.location.href;
    }

    function getReferrer() {
        return document.referrer || '';
    }

    function getSessionId() {
        var now = Date.now();
        
        // Check if session exists and is still valid
        if (state.sessionId && state.lastActivity && (now - state.lastActivity) < config.sessionTimeout) {
            state.lastActivity = now;
            return state.sessionId;
        }
        
        // Generate new session
        state.sessionId = generateUUID();
        state.lastActivity = now;
        return state.sessionId;
    }

    // Rate limiting and debouncing
    function canSendEvent() {
        var now = Date.now();
        var recentEvents = state.eventQueue.filter(function(event) {
            return (now - event.timestamp) < 1000; // Last second
        });
        
        return recentEvents.length < config.maxEventsPerSecond;
    }

    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var later = function() {
                clearTimeout(timeout);
                func();
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // API communication
    function sendEvent(eventData, retryCount) {
        retryCount = retryCount || 0;
        
        if (!canSendEvent()) {
            console.warn('RC Tracking: Rate limit exceeded, queuing event');
            state.eventQueue.push(eventData);
            return;
        }

        // Add timestamp and metadata
        eventData.timestamp = getTimestamp();
        eventData.metadata = eventData.metadata || {};
        eventData.metadata.ua = getUserAgent();
        eventData.metadata.viewport = getViewport();
        eventData.metadata.test_mode = false;

        // Add to queue for rate limiting
        state.eventQueue.push({
            timestamp: Date.now(),
            data: eventData
        });

        // Clean old events from queue
        var now = Date.now();
        state.eventQueue = state.eventQueue.filter(function(event) {
            return (now - event.timestamp) < 5000; // Keep last 5 seconds
        });

        // Send to API
        var xhr = new XMLHttpRequest();
        xhr.open('POST', config.apiEndpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-RC-Tracking-Key', config.trackingKey || window.RC_TRACKING_KEY || '');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    state.retryCount = 0;
                } else if (retryCount < config.retryMax) {
                    // Retry with exponential backoff
                    setTimeout(function() {
                        sendEvent(eventData, retryCount + 1);
                    }, config.retryDelay * Math.pow(2, retryCount));
                } else {
                    console.warn('RC Tracking: Failed to send event after retries:', eventData);
                }
            }
        };

        try {
            xhr.send(JSON.stringify(eventData));
        } catch (error) {
            console.warn('RC Tracking: Error sending event:', error);
        }
    }

    // Event tracking functions
    function trackEvent(action, customData) {
        if (!config.tenantId) {
            console.warn('RC Tracking: Not initialized. Call RC.init() first.');
            return;
        }

        var eventData = {
            tenant_id: config.tenantId,
            rc_vid: state.visitorId,
            session_id: getSessionId(),
            page_url: getCurrentPageUrl(),
            referrer: getReferrer(),
            action: action,
            duration_seconds: 0,
            score: 10, // Default score for page views
            metadata: customData || {}
        };

        sendEvent(eventData);
    }

    // Auto-tracking functions
    function trackPageView() {
        trackEvent('page_view');
    }

    function trackClick(event) {
        var element = event.target;
        var action = element.getAttribute('data-rc-action');
        if (action) {
            trackEvent('click', {
                element: element.tagName.toLowerCase(),
                action: action,
                text: element.textContent ? element.textContent.trim().substring(0, 100) : '',
                href: element.href || ''
            });
        }
    }

    function trackFormSubmit(event) {
        var form = event.target;
        if (form.getAttribute('data-rc-track') === 'true') {
            var formData = {
                form_id: form.id || '',
                form_action: form.action || '',
                form_method: form.method || 'POST'
            };

            // Try to extract email if present
            var emailInput = form.querySelector('input[type="email"], input[name*="email"], input[id*="email"]');
            if (emailInput && emailInput.value) {
                formData.email = emailInput.value;
            }

            trackEvent('form_submit', formData);
        }
    }

    // Public API
    RC.init = function(options) {
        options = options || {};
        
        // Set configuration
        config.tenantId = options.tenantId;
        config.trackingKey = options.trackingKey || window.RC_TRACKING_KEY;
        
        if (!config.tenantId) {
            console.error('RC Tracking: tenantId is required');
            return false;
        }

        // Get or create visitor ID
        state.visitorId = getCookie(config.cookieName);
        if (!state.visitorId) {
            state.visitorId = generateUUID();
            setCookie(config.cookieName, state.visitorId, config.cookieExpiry);
        }

        // Initialize session
        getSessionId();

        // Set up auto-tracking
        setupAutoTracking();

        console.log('RC Tracking initialized for tenant:', config.tenantId);
        return true;
    };

    RC.track = function(action, data) {
        trackEvent(action, data);
    };

    RC.setUserId = function(userId) {
        state.userId = userId;
    };

    // Auto-tracking setup
    function setupAutoTracking() {
        // Track page view on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', trackPageView);
        } else {
            trackPageView();
        }

        // Track clicks on elements with data-rc-action
        document.addEventListener('click', trackClick, true);

        // Track form submissions with data-rc-track="true"
        document.addEventListener('submit', trackFormSubmit, true);

        // Update session on activity
        ['click', 'scroll', 'keypress', 'mousemove'].forEach(function(eventType) {
            document.addEventListener(eventType, function() {
                getSessionId(); // This will update lastActivity
            }, { passive: true });
        });
    }

    // Initialize if config is already available
    if (window.RC_TRACKING_KEY && window.RC_TENANT_ID) {
        RC.init({
            tenantId: window.RC_TENANT_ID,
            trackingKey: window.RC_TRACKING_KEY
        });
    }

})(window, document);


