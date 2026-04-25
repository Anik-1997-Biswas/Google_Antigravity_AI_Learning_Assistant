/**
 * @fileoverview UI Interaction Engine (Premium Redesign)
 */

import { state } from './state.js';

export const elements = {
    screens: {
        setup:      document.getElementById('setup-view'),
        path:       document.getElementById('path-view'),
    },
    panels: {
        loading:    document.getElementById('ai-loading'),
        content:    document.getElementById('content-view'),
        quiz:       document.getElementById('quiz-module'),
        completion: document.getElementById('completion-module'),
        status:     document.getElementById('ai-status'),
    },
    nav: {
        xpBadge: document.getElementById('xp-count'),
        streak:  document.getElementById('streak-days'),
    },
    lesson: {
        badge:       document.getElementById('module-badge'),
        title:       document.getElementById('lesson-title'),
        content:     document.getElementById('lesson-content'),
        explanation: document.getElementById('lesson-explanation'),
        memory:      document.getElementById('memory-followup'),
        btnSimplify: document.getElementById('btn-simplify'),
        btnReady:    document.getElementById('btn-ready-quiz'),
        btnListen:   document.getElementById('btn-listen'),
    },
    quiz: {
        question: document.getElementById('quiz-question'),
        options:  document.getElementById('quiz-options'),
        feedback: document.getElementById('quiz-feedback'),
        btnNext:  document.getElementById('btn-next-module'),
    },
    completion: {
        topic:       document.getElementById('completion-topic'),
        btnNew:      document.getElementById('btn-new-topic'),
        btnViewCert: document.getElementById('btn-view-cert'),
    },
    modal: {
        overlay:   document.getElementById('cert-modal'),
        topicName: document.getElementById('cert-topic-name'),
        btnClose:  document.getElementById('btn-close-cert'),
    },
    misc: {
        announcer:  document.getElementById('aria-announcer'),
        thoughtLog: document.getElementById('thought-log'),
    }
};

/**
 * Premium Typing Effect for AI content generation.
 */
export async function typeContent(element, text, speed = 10) {
    element.innerHTML = '';
    return new Promise((resolve) => {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

/**
 * Agent Voice Synthesis (A11y & Wow Factor).
 */
let currentUtterance = null;
export function toggleVoice(text) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (elements.lesson.btnListen) {
            elements.lesson.btnListen.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        }
        return;
    }

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 1.1;
    currentUtterance.pitch = 1.0;

    currentUtterance.onend = () => {
        if (elements.lesson.btnListen) {
            elements.lesson.btnListen.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        }
    };

    window.speechSynthesis.speak(currentUtterance);
    if (elements.lesson.btnListen) {
        elements.lesson.btnListen.innerHTML = '<i class="fa-solid fa-circle-stop"></i> Stop';
    }
}

export function updateStatsUI() {
    requestAnimationFrame(() => {
        if (elements.nav.xpBadge) elements.nav.xpBadge.textContent = state.xp;
        if (elements.nav.streak)  elements.nav.streak.textContent  = state.streak;
    });
}

export function announce(msg) {
    if (!elements.misc.announcer) return;
    elements.misc.announcer.textContent = msg;
}

export function hideAllOutputs() {
    Object.values(elements.panels).forEach(p => {
        if (p) p.classList.add('hidden');
    });
}
