/**
 * @fileoverview UI Interaction Engine
 * Handles DOM manipulation with high efficiency and accessibility focus.
 */

import { state } from './state.js';

export const elements = {
    screens: {
        onboarding: document.getElementById('onboarding-screen'),
        dashboard:  document.getElementById('dashboard-screen'),
    },
    panels: {
        loading:    document.getElementById('ai-loading'),
        lesson:     document.getElementById('lesson-module'),
        quiz:       document.getElementById('quiz-module'),
        completion: document.getElementById('completion-module'),
    },
    nav: {
        topic:   document.getElementById('nav-topic-display'),
        xpBadge: document.getElementById('xp-count'),
    },
    sidebar: {
        list:         document.getElementById('learning-path-list'),
        progressFill: document.getElementById('overall-progress'),
        progressText: document.getElementById('progress-text'),
        goalTag:      document.getElementById('goal-tag'),
        totalPoints:  document.getElementById('total-points'),
        streakDays:   document.getElementById('streak-days'),
        progressRegion: document.getElementById('progress-region'),
    },
    lesson: {
        badge:     document.getElementById('module-badge'),
        time:      document.getElementById('module-time-display'),
        title:     document.getElementById('lesson-title'),
        content:   document.getElementById('lesson-content'),
        btnSimplify: document.getElementById('btn-simplify'),
        btnReady:    document.getElementById('btn-ready-quiz'),
    },
    quiz: {
        question: document.getElementById('quiz-question'),
        options:  document.getElementById('quiz-options'),
        feedback: document.getElementById('quiz-feedback'),
        actions:  document.getElementById('quiz-actions'),
        btnNext:  document.getElementById('btn-next-module'),
    },
    completion: {
        topic:            document.getElementById('completion-topic'),
        modulesCount:     document.getElementById('stat-modules'),
        adaptationsCount: document.getElementById('stat-adaptations'),
        btnNew:           document.getElementById('btn-new-topic'),
        btnViewCert:      document.getElementById('btn-view-cert'),
    },
    modal: {
        overlay:    document.getElementById('cert-modal'),
        topicName:  document.getElementById('cert-topic-name'),
        date:       document.getElementById('cert-date'),
        btnClose:   document.getElementById('btn-close-cert'),
    },
    misc: {
        announcer: document.getElementById('aria-announcer'),
        formError: document.getElementById('form-error'),
    }
};

/**
 * Optimized UI update using requestAnimationFrame.
 */
export function updateStatsUI() {
    requestAnimationFrame(() => {
        elements.nav.xpBadge.textContent = state.xp;
        elements.sidebar.totalPoints.textContent = state.xp;
        elements.sidebar.streakDays.textContent = state.streak;
    });
}

/**
 * Announces content to screen readers.
 */
export function announce(msg) {
    if (!elements.misc.announcer) return;
    elements.misc.announcer.textContent = '';
    requestAnimationFrame(() => {
        elements.misc.announcer.textContent = msg;
    });
}

/**
 * Advanced focus management for screen transitions.
 */
export function switchScreen(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
        from.classList.add('hidden');
        to.classList.remove('hidden');
        requestAnimationFrame(() => {
            to.classList.add('active');
            const focusTarget = to.querySelector('h1, h2, input, button');
            if (focusTarget) focusTarget.focus();
        });
    }, 300);
}

/**
 * Hardened focus trap for modals.
 */
export function trapFocus(el) {
    const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    el.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });
}
