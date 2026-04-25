/**
 * @fileoverview Lumina Learn — Premium Agent Orchestrator
 */

import { state, CONFIG } from './js/state.js';
import { elements, announce, updateStatsUI, typeContent, hideAllOutputs } from './js/ui.js';
import { sanitize, trackEvent } from './js/services.js';
import { Agent } from './js/agent.js';

/* ── 1. INITIALIZATION ────────────────────────────────────── */

function init() {
    // Force unregister stale service workers for clean demo
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            for(let reg of regs) reg.unregister();
        });
    }
    setupListeners();
    announce('AI Interface initialized.');
}

/* ── 2. AGENTIC WORKFLOW ──────────────────────────────────── */

async function handleStart(e) {
    e.preventDefault();
    const topicVal = document.getElementById('topic-input').value.trim();
    
    if (!topicVal) return;

    state.topic = sanitize(topicVal);
    state.level = document.getElementById('level-select').value;
    state.goal  = document.getElementById('goal-select').value;
    state.history.push(state.topic);

    updateStatsUI();
    hideAllOutputs();
    elements.panels.status.classList.remove('hidden');
    elements.panels.loading.classList.remove('hidden');
    
    // Switch left panel view
    elements.screens.setup.classList.add('hidden');
    elements.screens.path.classList.remove('hidden');

    await runReasoningFlow();
}

async function runReasoningFlow() {
    const log = elements.misc.thoughtLog;
    log.innerHTML = '';

    const logStep = (m) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = `> ${m}`;
        log.appendChild(line);
    };

    // Step 1: Analyze Intent
    logStep('Analyzing user intent and goal alignment...');
    const analysis = await Agent.analyzeIntent(state.topic, state.level, state.goal);
    await new Promise(r => setTimeout(r, 150)); // Fast: just show the log line

    // Step 2: Create Plan
    logStep(`Detected ${analysis.complexity} complexity — designing path...`);
    const plan = await Agent.createPlan(analysis);
    await new Promise(r => setTimeout(r, 150)); // Fast

    // Step 3: Generate all modules in parallel (instant)
    logStep('Generating curriculum modules in parallel...');
    
    // Parallel content generation — all 3 modules built simultaneously
    const contentResults = await Promise.all(plan.map((_, idx) => Agent.generateContent(idx)));
    state.modules = contentResults.map((content, idx) => ({
        title: plan[idx].action,
        explanation: content.explanation,
        examples: content.examples,
        memory: content.followUp,
        quiz: {
            q: `Verification: ${plan[idx].objective}?`,
            options: [{ t: 'Correct Objective', c: true }, { t: 'Incorrect Objective', c: false }],
            exp: `The agent confirmed the ${plan[idx].objective} target.`
        }
    }));
    
    await new Promise(r => setTimeout(r, 150)); // Brief pause to show completion log
    logStep('✓ Curriculum ready. Loading module 1...');

    loadModule(0);
}

async function loadModule(idx) {
    state.currentModuleIndex = idx;
    hideAllOutputs();
    renderPath();

    const m = state.modules[idx];
    elements.panels.status.classList.remove('hidden');
    elements.panels.content.classList.remove('hidden');
    
    elements.lesson.badge.textContent = `Module ${idx + 1}`;
    elements.lesson.title.textContent = m.title;
    
    // Premium Typing Effect for content
    await typeContent(elements.lesson.content, `Core Insight: ${m.title}. Based on your goal of ${state.goal}, we are analyzing the specific mechanics. ${m.explanation}`);
    
    elements.lesson.explanation.innerHTML = `<h4>Analysis Depth</h4><ul>${m.examples.map(e => `<li>${e}</li>`).join('')}</ul>`;
    elements.lesson.memory.textContent = m.memory;
}

function renderPath() {
    elements.screens.path.querySelector('ul').innerHTML = '';
    state.modules.forEach((m, i) => {
        const li = document.createElement('li');
        li.className = `path-item ${i === state.currentModuleIndex ? 'active' : ''}`;
        li.textContent = m.title;
        elements.screens.path.querySelector('ul').appendChild(li);
    });
}

function showQuiz() {
    hideAllOutputs();
    const q = state.modules[state.currentModuleIndex].quiz;
    elements.quiz.question.textContent = q.q;
    elements.quiz.options.innerHTML = '';
    elements.quiz.feedback.classList.add('hidden');
    elements.quiz.btnNext.classList.add('hidden');

    q.options.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = o.t;
        btn.onclick = () => {
            elements.quiz.feedback.classList.remove('hidden');
            if (o.c) {
                elements.quiz.feedback.textContent = 'Verification Successful. XP awarded.';
                elements.quiz.btnNext.classList.remove('hidden');
                state.xp += CONFIG.XP_PER_QUIZ;
                updateStatsUI();
            } else {
                elements.quiz.feedback.textContent = 'Verification Failed. Re-analyzing module.';
                setTimeout(() => loadModule(state.currentModuleIndex), 1500);
            }
        };
        elements.quiz.options.appendChild(btn);
    });

    elements.panels.quiz.classList.remove('hidden');
}

/* ── 3. SYSTEM ────────────────────────────────────────────── */

function setupListeners() {
    document.getElementById('onboarding-form').addEventListener('submit', handleStart);
    
    // Theme Toggle
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#btn-theme-toggle i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });
    elements.lesson.btnReady.addEventListener('click', showQuiz);
    elements.lesson.btnListen.addEventListener('click', () => {
        const text = elements.lesson.title.textContent + '. ' + elements.lesson.content.textContent;
        import('./js/ui.js').then(ui => ui.toggleVoice(text));
    });
    elements.quiz.btnNext.addEventListener('click', () => {
        if (state.currentModuleIndex < state.modules.length - 1) {
            loadModule(state.currentModuleIndex + 1);
        } else {
            showCompletion();
        }
    });
    elements.completion.btnViewCert.addEventListener('click', showCertificate);
    document.getElementById('btn-download-cert').addEventListener('click', () => window.print());
    document.getElementById('btn-share-linkedin').addEventListener('click', (e) => {
        e.preventDefault();
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=I%20just%20mastered%20${state.topic}%20on%20Lumina%20Learn!`;
        window.open(url, '_blank');
    });
    elements.completion.btnNew.addEventListener('click', () => location.reload());
}

function showCompletion() {
    hideAllOutputs();
    elements.completion.topic.textContent = state.topic;
    elements.panels.completion.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);
