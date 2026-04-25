'use strict';

/**
 * @fileoverview Lumina Learn — Premium Adaptive AI Learning Assistant
 * @version      2.1.0
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
    streak: 1, // Default mock streak
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
   HELPERS & UTILS
   ================================================================ */

function trackEvent(name, params = {}) {
    try { if (typeof gtag === 'function') gtag('event', name, params); } catch (e) {}
}

function announce(msg) {
    if (!elements.misc.announcer) return;
    elements.misc.announcer.textContent = '';
    requestAnimationFrame(() => elements.misc.announcer.textContent = msg);
}

function escapeHTML(str) {
    const m = {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'};
    return String(str).replace(/[&<>'"]/g, t => m[t] || t);
}

function updateStatsUI() {
    elements.nav.xpBadge.textContent = state.xp;
    elements.sidebar.totalPoints.textContent = state.xp;
    elements.sidebar.streakDays.textContent = state.streak;
}

function hideAllPanels() {
    Object.values(elements.panels).forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('slide-in-up');
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
        return;
    }

    state.topic = topicValue;
    state.level = levelInput.value;
    state.goal  = goalInput.value;

    // Update UI
    elements.nav.topic.innerHTML = `Learning: <strong>${escapeHTML(state.topic)}</strong>`;
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
    announce('Designing your curriculum...');

    setTimeout(() => {
        state.modules = buildPremiumModules(state.topic, state.level, state.goal);
        renderSidebar();
        loadModule(0);
    }, CONFIG.AI_DELAY_MS);
}

function buildPremiumModules(topic, level, goal) {
    const t = escapeHTML(topic);
    return [
        {
            title: `Foundations of ${topic}`,
            time: '5 min',
            content: `<p>Welcome to your mastery journey of <strong>${t}</strong>. Since your goal is <em>${escapeHTML(goal)}</em>, we've optimized this starting module to highlight core principles first.</p><p>Key Focus Areas:</p><ul><li>Conceptual Framework of ${t}</li><li>Historical Evolution</li><li>Current Industry Standards</li></ul>`,
            simplified: `<p>Let's make <strong>${t}</strong> easy. It's like the DNA of this subject — everything else grows from here.</p>`,
            quiz: {
                q: `What is the primary role of the Foundations module in your ${escapeHTML(goal)} journey?`,
                options: [
                    { t: `To provide the mandatory starting framework.`, c: true },
                    { t: `To skip to advanced use cases immediately.`, c: false },
                    { t: `To focus purely on memorizing names.`, c: false }
                ],
                exp: `Foundations build the structure needed for mastery.`
            }
        },
        {
            title: `Operational Mechanics`,
            time: '8 min',
            content: `<p>Moving beyond theory, we now examine the mechanics of <strong>${t}</strong>. We'll look at the 'How' behind the 'What'.</p><ul><li>Systematic Workflow</li><li>Component Interdependence</li><li>Optimization Strategies</li></ul>`,
            simplified: `<p>Think of it like a machine. We're looking at how the gears turn together to produce results in ${t}.</p>`,
            quiz: {
                q: `How do mechanics differ from foundations in this context?`,
                options: [
                    { t: `Foundations are 'What', Mechanics are 'How'.`, c: true },
                    { t: `They are exactly the same thing.`, c: false },
                    { t: `Mechanics are less important for ${escapeHTML(goal)}.`, c: false }
                ],
                exp: `Mechanics explain the functional processes.`
            }
        },
        {
            title: `Strategic Implementation`,
            time: '6 min',
            content: `<p>In this final stage, we bridge to <em>Strategic Mastery</em>. This is where you apply ${t} to solve high-value problems.</p><ul><li>Real-world Application</li><li>Risk Assessment</li><li>Future Trends in ${t}</li></ul>`,
            simplified: `<p>This is the "Pro" level. You use your tools to build something amazing with ${t}.</p>`,
            quiz: {
                q: `What is the final step in achieving your goal of ${escapeHTML(goal)}?`,
                options: [
                    { t: `Strategic implementation in real-world scenarios.`, c: true },
                    { t: `Simply finishing the reading material.`, c: false },
                    { t: `Deleting the app and moving on.`, c: false }
                ],
                exp: `Strategy is the pinnacle of the learning journey.`
            }
        }
    ];
}

function renderSidebar() {
    elements.sidebar.list.innerHTML = '';
    const frag = document.createDocumentFragment();
    state.modules.forEach((m, i) => {
        const li = document.createElement('li');
        li.className = `path-item ${i === state.currentModuleIndex ? 'active' : ''}`;
        li.innerHTML = `
            <div style="display:flex; align-items:center; gap: 1rem;">
                <div class="path-icon"><i class="fa-solid ${i < state.currentModuleIndex ? 'fa-check-circle' : 'fa-circle-dot'}"></i></div>
                <div>
                    <h3 style="font-size: 0.9rem;">${m.title}</h3>
                    <div class="module-time"><i class="fa-regular fa-clock"></i> ${m.time}</div>
                </div>
            </div>
        `;
        frag.appendChild(li);
    });
    elements.sidebar.list.appendChild(frag);
    
    const prog = Math.round((state.currentModuleIndex / state.modules.length) * 100);
    elements.sidebar.progressFill.style.width = `${prog}%`;
    elements.sidebar.progressText.textContent = `${prog}% Done`;
}

function loadModule(idx) {
    hideAllPanels();
    state.currentModuleIndex = idx;
    state.isSimplifying = false;
    renderSidebar();

    const m = state.modules[idx];
    elements.lesson.badge.textContent = `Module ${idx + 1} of ${state.modules.length}`;
    elements.lesson.time.innerHTML = `<i class="fa-regular fa-clock"></i> ${m.time}`;
    elements.lesson.title.textContent = m.title;
    elements.lesson.content.innerHTML = m.content;
    
    elements.lesson.btnSimplify.disabled = false;
    elements.lesson.btnSimplify.innerHTML = '<i class="fa-solid fa-wand-sparkles"></i> Simplify';

    elements.panels.lesson.classList.remove('hidden');
    void elements.panels.lesson.offsetWidth;
    elements.panels.lesson.classList.add('slide-in-up');
    
    announce(`Module ${idx + 1} loaded.`);
    trackEvent('module_load', { index: idx });
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
        elements.lesson.btnSimplify.innerHTML = '<i class="fa-solid fa-check"></i> Simplified';
        announce('Content simplified.');
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
        div.innerHTML = `<div class="option-indicator">${String.fromCharCode(65 + i)}</div><div class="option-text">${escapeHTML(o.t)}</div>`;
        div.addEventListener('click', () => handleQuiz(div, o, q.exp));
        elements.quiz.options.appendChild(div);
    });

    elements.panels.quiz.classList.remove('hidden');
    void elements.panels.quiz.offsetWidth;
    elements.panels.quiz.classList.add('slide-in-up');
}

function handleQuiz(el, o, exp) {
    document.querySelectorAll('.quiz-option').forEach(opt => opt.style.pointerEvents = 'none');
    el.classList.add('selected');

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
            elements.quiz.btnNext.innerHTML = isLast ? 'Finish Journey <i class="fa-solid fa-trophy"></i>' : 'Next Module <i class="fa-solid fa-arrow-right"></i>';
        } else {
            el.classList.add('incorrect');
            elements.quiz.feedback.classList.add('error');
            elements.quiz.feedback.innerHTML = `<strong>Keep trying.</strong> Let's review the concepts.`;
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
    trackEvent('journey_complete', { topic: state.topic, xp: state.xp });
}

function showCertificate() {
    elements.modal.topicName.textContent = state.topic;
    elements.modal.date.textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    elements.modal.overlay.classList.add('active');
    trackEvent('certificate_viewed');
}

function closeCertificate() {
    elements.modal.overlay.classList.remove('active');
}

function reset() {
    location.reload(); // Hard reset for clean slate
}

/* ================================================================
   LISTENERS
   ================================================================ */
document.getElementById('onboarding-form').addEventListener('submit', handleOnboarding);
elements.lesson.btnSimplify.addEventListener('click', simplifyLesson);
elements.lesson.btnReady.addEventListener('click', showQuiz);
elements.quiz.btnNext.addEventListener('click', nextModule);
elements.completion.btnNew.addEventListener('click', reset);
elements.completion.btnViewCert.addEventListener('click', showCertificate);
elements.modal.btnClose.addEventListener('click', closeCertificate);
elements.modal.overlay.addEventListener('click', (e) => { if(e.target === elements.modal.overlay) closeCertificate(); });
