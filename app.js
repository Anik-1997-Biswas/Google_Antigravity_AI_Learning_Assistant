'use strict';

/**
 * @fileoverview Lumina Learn — Premium Adaptive AI Learning Assistant
 * Hardened for Security, Accessibility, and Efficiency.
 */

/* ================================================================
   CONFIG
   ================================================================ */
const CONFIG = Object.freeze({
    AI_DELAY_MS: 1800,
    CONTENT_SWAP_MS: 300,
    MAX_TOPIC_LENGTH: 100,
    GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    XP_PER_MODULE: 150,
    XP_PER_QUIZ: 250,
});

/* ================================================================
   STATE
   ================================================================ */
const state = {
    topic: '',
    level: '',
    goal: '',
    currentModuleIndex: 0,
    modules: [],
    adaptations: 0,
    isSimplifying: false,
    xp: 0,
    streak: 1,
};

/* ================================================================
   DOM CACHE
   ================================================================ */
const elements = {
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

/* ================================================================
   CORE UTILITIES (Security & Quality)
   ================================================================ */

/**
 * Sanitizes input to prevent XSS.
 * @param {string} str 
 */
function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function trackEvent(name, params = {}) {
    try { if (typeof gtag === 'function') gtag('event', name, params); } catch (e) {}
}

function announce(msg) {
    if (!elements.misc.announcer) return;
    elements.misc.announcer.textContent = '';
    // Use requestAnimationFrame for accessibility announcement consistency
    requestAnimationFrame(() => elements.misc.announcer.textContent = msg);
}

function updateStatsUI() {
    requestAnimationFrame(() => {
        elements.nav.xpBadge.textContent = state.xp;
        elements.sidebar.totalPoints.textContent = state.xp;
        elements.sidebar.streakDays.textContent = state.streak;
    });
}

function hideAllPanels() {
    Object.values(elements.panels).forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('slide-in-up');
    });
}

/* ================================================================
   ACCESSIBILITY: Focus Trap for Modal
   ================================================================ */
function setupFocusTrap(modalEl) {
    const focusableEls = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    modalEl.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

/* ================================================================
   BUSINESS LOGIC
   ================================================================ */

function handleOnboarding(e) {
    e.preventDefault();
    const topicInput = document.getElementById('topic-input');
    const levelInput = document.getElementById('level-select');
    const goalInput  = document.getElementById('goal-select');

    const topicValue = topicInput.value.trim();
    if (!topicValue) {
        elements.misc.formError.textContent = 'Please enter a topic.';
        elements.misc.formError.classList.remove('hidden');
        announce('Error: Please enter a topic.');
        return;
    }

    state.topic = sanitize(topicValue);
    state.level = levelInput.value;
    state.goal  = goalInput.value;

    elements.nav.topic.innerHTML = `Learning: <strong>${state.topic}</strong>`;
    elements.sidebar.goalTag.textContent = `Goal: ${state.goal.charAt(0).toUpperCase() + state.goal.slice(1)}`;
    updateStatsUI();

    elements.screens.onboarding.classList.remove('active');
    setTimeout(() => {
        elements.screens.dashboard.classList.remove('hidden');
        elements.screens.dashboard.classList.add('active');
        generateCurriculum();
    }, CONFIG.CONTENT_SWAP_MS);

    trackEvent('onboarding_complete', { topic: state.topic, level: state.level, goal: state.goal });
}

function generateCurriculum() {
    hideAllPanels();
    elements.panels.loading.classList.remove('hidden');
    announce('Designing your curriculum. Please wait.');

    setTimeout(() => {
        state.modules = buildPremiumModules(state.topic, state.level, state.goal);
        renderSidebar();
        loadModule(0);
    }, CONFIG.AI_DELAY_MS);
}

function buildPremiumModules(topic, level, goal) {
    const t = topic; // Already sanitized
    return [
        {
            title: `Foundations of ${topic}`,
            time: '5 min',
            content: `<p>Welcome to your mastery journey of <strong>${t}</strong>. Since your goal is <em>${goal}</em>, we've optimized this starting module to highlight core principles first.</p>`,
            simplified: `<p>Let's make <strong>${t}</strong> easy. Foundations are the building blocks.</p>`,
            quiz: {
                q: `What is the primary role of Foundations in your ${goal} journey?`,
                options: [
                    { t: `To provide a mandatory starting framework.`, c: true },
                    { t: `To skip to advanced use cases.`, c: false }
                ],
                exp: `Foundations build the structure needed for mastery.`
            }
        },
        {
            title: `Operational Mechanics`,
            time: '8 min',
            content: `<p>Examining the mechanics of <strong>${t}</strong>. We'll look at the 'How' behind the 'What'.</p>`,
            simplified: `<p>Looking at how the gears turn together in ${t}.</p>`,
            quiz: {
                q: `How do mechanics differ from foundations?`,
                options: [
                    { t: `Foundations are 'What', Mechanics are 'How'.`, c: true },
                    { t: `They are identical.`, c: false }
                ],
                exp: `Mechanics explain functional processes.`
            }
        },
        {
            title: `Strategic Implementation`,
            time: '6 min',
            content: `<p>Applying ${t} to solve high-value problems.</p>`,
            simplified: `<p>Using your tools to build something amazing with ${t}.</p>`,
            quiz: {
                q: `What is the final step in your ${goal} goal?`,
                options: [
                    { t: `Strategic implementation in real-world scenarios.`, c: true },
                    { t: `Reading the material once.`, c: false }
                ],
                exp: `Strategy is the pinnacle of the learning journey.`
            }
        }
    ];
}

function renderSidebar() {
    const frag = document.createDocumentFragment();
    state.modules.forEach((m, i) => {
        const li = document.createElement('li');
        li.className = `path-item ${i === state.currentModuleIndex ? 'active' : ''}`;
        li.setAttribute('role', 'listitem');
        li.innerHTML = `
            <div style="display:flex; align-items:center; gap: 1rem;">
                <div class="path-icon"><i class="fa-solid ${i < state.currentModuleIndex ? 'fa-check-circle' : 'fa-circle-dot'}" aria-hidden="true"></i></div>
                <div>
                    <h3 style="font-size: 0.9rem;">${m.title}</h3>
                    <div class="module-time"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${m.time}</div>
                </div>
            </div>
        `;
        frag.appendChild(li);
    });
    
    requestAnimationFrame(() => {
        elements.sidebar.list.innerHTML = '';
        elements.sidebar.list.appendChild(frag);
        const prog = Math.round((state.currentModuleIndex / state.modules.length) * 100);
        elements.sidebar.progressFill.style.width = `${prog}%`;
        elements.sidebar.progressText.textContent = `${prog}% Done`;
        elements.sidebar.progressRegion.setAttribute('aria-valuenow', prog);
    });
}

function loadModule(idx) {
    hideAllPanels();
    state.currentModuleIndex = idx;
    state.isSimplifying = false;
    renderSidebar();

    const m = state.modules[idx];
    elements.lesson.badge.textContent = `Module ${idx + 1} of ${state.modules.length}`;
    elements.lesson.time.innerHTML = `<i class="fa-regular fa-clock" aria-hidden="true"></i> ${m.time}`;
    elements.lesson.title.textContent = m.title;
    elements.lesson.content.innerHTML = m.content;
    
    elements.lesson.btnSimplify.disabled = false;
    elements.lesson.btnSimplify.innerHTML = '<i class="fa-solid fa-wand-sparkles" aria-hidden="true"></i> Simplify';

    elements.panels.lesson.classList.remove('hidden');
    void elements.panels.lesson.offsetWidth;
    elements.panels.lesson.classList.add('slide-in-up');
    
    announce(`Module ${idx + 1} loaded: ${m.title}`);
}

function simplifyLesson() {
    if (state.isSimplifying) return;
    state.isSimplifying = true;
    state.adaptations++;
    
    const m = state.modules[state.currentModuleIndex];
    elements.lesson.content.style.opacity = '0';
    
    setTimeout(() => {
        elements.lesson.content.innerHTML = `<div class="simplified-banner"><small>Simplified View</small></div>${m.simplified}`;
        elements.lesson.content.style.opacity = '1';
        elements.lesson.btnSimplify.disabled = true;
        elements.lesson.btnSimplify.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Simplified';
        announce('Lesson simplified for easier understanding.');
    }, CONFIG.CONTENT_SWAP_MS);
}

function showQuiz() {
    hideAllPanels();
    const q = state.modules[state.currentModuleIndex].quiz;
    elements.quiz.question.textContent = q.q;
    elements.quiz.options.innerHTML = '';
    elements.quiz.feedback.classList.add('hidden');
    elements.quiz.actions.classList.add('hidden');

    q.options.forEach((o, i) => {
        const div = document.createElement('div');
        div.className = 'quiz-option';
        div.setAttribute('role', 'radio');
        div.setAttribute('aria-checked', 'false');
        div.setAttribute('tabindex', '0');
        div.innerHTML = `<div class="option-indicator">${String.fromCharCode(65 + i)}</div><div class="option-text">${o.t}</div>`;
        
        const clickHandler = () => handleQuiz(div, o, q.exp);
        div.addEventListener('click', clickHandler);
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickHandler(); }});
        
        elements.quiz.options.appendChild(div);
    });

    elements.panels.quiz.classList.remove('hidden');
    void elements.panels.quiz.offsetWidth;
    elements.panels.quiz.classList.add('slide-in-up');
    announce('Concept check quiz started.');
}

function handleQuiz(el, o, exp) {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.setAttribute('tabindex', '-1');
    });
    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');

    setTimeout(() => {
        elements.quiz.feedback.classList.remove('hidden', 'success', 'error');
        if (o.c) {
            el.classList.add('correct');
            elements.quiz.feedback.classList.add('success');
            elements.quiz.feedback.innerHTML = `<strong>Mastered!</strong> ${exp}`;
            state.xp += CONFIG.XP_PER_QUIZ;
            updateStatsUI();
            elements.quiz.actions.classList.remove('hidden');
            const isLast = state.currentModuleIndex === state.modules.length - 1;
            elements.quiz.btnNext.innerHTML = isLast ? 'Finish Journey <i class="fa-solid fa-trophy" aria-hidden="true"></i>' : 'Next Module <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
            announce('Correct! ' + exp);
        } else {
            el.classList.add('incorrect');
            elements.quiz.feedback.classList.add('error');
            elements.quiz.feedback.innerHTML = `<strong>Not quite.</strong> Let's review and try again.`;
            announce('Incorrect. Reloading module for review.');
            setTimeout(() => loadModule(state.currentModuleIndex), 1500);
        }
    }, 600);
}

function nextModule() {
    state.xp += CONFIG.XP_PER_MODULE;
    if (state.currentModuleIndex < state.modules.length - 1) {
        loadModule(state.currentModuleIndex + 1);
    } else {
        showCompletion();
    }
}

function showCompletion() {
    hideAllPanels();
    state.currentModuleIndex++;
    renderSidebar();
    elements.completion.topic.textContent = state.topic;
    elements.completion.modulesCount.textContent = state.modules.length;
    elements.completion.adaptationsCount.textContent = state.adaptations;
    elements.panels.completion.classList.remove('hidden');
    void elements.panels.completion.offsetWidth;
    elements.panels.completion.classList.add('slide-in-up');
    announce('Congratulations! You have mastered ' + state.topic);
}

function showCertificate() {
    elements.modal.topicName.textContent = state.topic;
    elements.modal.date.textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    elements.modal.overlay.classList.add('active');
    elements.modal.btnClose.focus();
    setupFocusTrap(elements.modal.overlay);
    announce('Certificate of Mastery opened.');
}

function closeCertificate() {
    elements.modal.overlay.classList.remove('active');
    elements.completion.btnViewCert.focus();
    announce('Certificate closed.');
}

/* ================================================================
   LISTENERS
   ================================================================ */
document.getElementById('onboarding-form').addEventListener('submit', handleOnboarding);
elements.lesson.btnSimplify.addEventListener('click', simplifyLesson);
elements.lesson.btnReady.addEventListener('click', showQuiz);
elements.quiz.btnNext.addEventListener('click', nextModule);
elements.completion.btnNew.addEventListener('click', () => location.reload());
elements.completion.btnViewCert.addEventListener('click', showCertificate);
elements.modal.btnClose.addEventListener('click', closeCertificate);
elements.modal.overlay.addEventListener('click', (e) => { if(e.target === elements.modal.overlay) closeCertificate(); });

// Global Escape key handler for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modal.overlay.classList.contains('active')) {
        closeCertificate();
    }
});
