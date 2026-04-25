/**
 * @fileoverview Analytics & Security Core
 * Handles PII-safe tracking and input sanitization.
 */

/**
 * Sanitizes input using a virtual DOM to prevent XSS.
 */
export function sanitize(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Robust GA4 event tracking with fallback.
 */
export function trackEvent(name, params = {}) {
    try {
        if (typeof gtag === 'function') {
            gtag('event', name, {
                ...params,
                timestamp: new Date().toISOString(),
                platform: 'web'
            });
        }
    } catch (e) {
        console.error('Tracking Error:', e);
    }
}

/**
 * Performance Monitoring using User Timing API.
 */
export function markTime(name) {
    if (window.performance && window.performance.mark) {
        window.performance.mark(name);
    }
}
