/**
 * @fileoverview App State & Memory
 */

export const CONFIG = Object.freeze({
    AI_DELAY_MS: 1800,
    CONTENT_SWAP_MS: 300,
    MAX_TOPIC_LENGTH: 100,
    XP_PER_MODULE: 150,
    XP_PER_QUIZ: 250,
});

export const state = new Proxy({
    // User Context
    topic: '',
    level: '',
    goal: '',
    history: [], // Memory of previous topics/interactions
    
    // Agent Reasoning
    currentAnalysis: null,
    currentPlan: [],
    
    // Application State
    currentModuleIndex: 0,
    modules: [],
    adaptations: 0,
    isSimplifying: false,
    xp: 0,
    streak: 1,
}, {
    set(target, prop, value) {
        target[prop] = value;
        return true;
    }
});
