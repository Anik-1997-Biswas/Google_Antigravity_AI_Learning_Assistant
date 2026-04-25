/**
 * @fileoverview Lumina Learn — Agentic AI Orchestrator
 * This entry point manages the multi-step reasoning flow.
 */

import { state, CONFIG } from './js/state.js';
import { elements, announce, updateStatsUI, switchScreen, trapFocus } from './js/ui.js';
import { sanitize, trackEvent, markTime } from './js/services.js';
import { Agent } from './js/agent.js';

/* ── 1. INITIALIZATION ────────────────────────────────────── */

function init() {
    markTime('app-start');
    setupGlobalListeners();
    registerServiceWorker();
    announce('Lumina Agent System active.');
}

/* ── 2. AGENTIC ORCHESTRATION ────────────────────────────── */

async function handleOnboarding(e) {
    e.preventDefault();
    const topicVal = document.getElementById('topic-input').value.trim();
    
    if (!topicVal) {
        elements.misc.formError.textContent = 'Topic required for agent processing.';
        elements.misc.formError.classList.remove('hidden');
        return;
    }

    // Context Memory: Store topic in history
    state.topic = sanitize(topicVal);
    state.level = document.getElementById('level-select').value;
    state.goal  = document.getElementById('goal-select').value;
    state.history.push(state.topic);

    elements.nav.topic.innerHTML = `Learning: <strong>${state.topic}</strong>`;
    elements.sidebar.goalTag.textContent = `Goal: ${state.goal.charAt(0).toUpperCase() + state.goal.slice(1)}`;
    updateStatsUI();

    switchScreen(elements.screens.onboarding, elements.screens.dashboard);
    startAgentReasoning();
}

/**
 * The "Agent reasoning" multi-step flow.
 */
async function startAgentReasoning() {
    const log = document.getElementById('thought-log');
    const logStep = (msg) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<i class="fa-solid fa-chevron-right"></i> ${msg}`;
        log.appendChild(line);
        announce(msg);
    };

    elements.panels.loading.classList.remove('hidden');
    log.innerHTML = '';
    
    // Step 1: Analyze Intent
    logStep('Analyzing user intent and goal alignment...');
    const analysis = await Agent.analyzeIntent(state.topic, state.level, state.goal);
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Create Plan
    logStep(`Detected ${analysis.complexity} complexity. Designing multi-step plan...`);
    const plan = await Agent.createPlan(analysis);
    await new Promise(r => setTimeout(r, 1000));

    // Step 3: Execute Step 1
    logStep('Executing plan step 1: Building Foundational Content...');
    await new Promise(r => setTimeout(r, 600));

    // Finish reasoning and load first module
    elements.panels.loading.classList.add('hidden');
    
    // Convert plan into modules
    state.modules = await Promise.all(plan.map(async (p, idx) => {
        const content = await Agent.generateContent(idx);
        return {
            title: p.action,
            time: '5 min',
            content: `<h3>Reasoning Output</h3><p>${content.explanation}</p><h4>Key Examples</h4><ul>${content.examples.map(ex => `<li>${ex}</li>`).join('')}</ul><div class="agent-memory-box"><i class="fa-solid fa-lightbulb"></i> ${content.followUp}</div>`,
            simplified: `<p>Simple version of ${p.objective}.</p>`,
            quiz: {
                q: `What was the agent's objective in this step?`,
                options: [{ t: p.objective, c: true }, { t: 'Random objective', c: false }],
                exp: `The agent correctly targeted ${p.objective} based on your goal.`
            }
        };
    }));

    loadModule(0);
}

function loadModule(idx) {
    state.currentModuleIndex = idx;
    renderSidebar();

    const m = state.modules[idx];
    elements.lesson.title.textContent = m.title;
    elements.lesson.content.innerHTML = m.content;
    
    elements.panels.lesson.classList.remove('hidden');
    announce(`Module ${idx + 1} ready.`);
}

function renderSidebar() {
    const frag = document.createDocumentFragment();
    state.modules.forEach((m, i) => {
        const li = document.createElement('li');
        li.className = `path-item ${i === state.currentModuleIndex ? 'active' : ''}`;
        li.innerHTML = `<h3 style="font-size: 0.85rem;">${m.title}</h3>`;
        frag.appendChild(li);
    });
    
    requestAnimationFrame(() => {
        elements.sidebar.list.innerHTML = '';
        elements.sidebar.list.appendChild(frag);
    });
}

/* ── 3. SYSTEM ────────────────────────────────────────────── */

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('SW registration failed: ', err);
            });
        });
    }
}

function setupGlobalListeners() {
    document.getElementById('onboarding-form').addEventListener('submit', handleOnboarding);
    elements.lesson.btnReady.addEventListener('click', () => {
        elements.panels.lesson.classList.add('hidden');
        elements.panels.quiz.classList.remove('hidden');
        announce('Quiz started.');
    });
    elements.completion.btnNew.addEventListener('click', () => location.reload());
}

document.addEventListener('DOMContentLoaded', init);
