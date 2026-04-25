/**
 * Pure logic functions for Lumina Learn
 * Exported for testing and modular use.
 */

function escapeHTML(str) {
    const m = {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'};
    return String(str).replace(/[&<>'"]/g, t => m[t] || t);
}

function validateTopic(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'Please enter a topic.' };
    if (trimmed.length > 100) return { valid: false, message: 'Topic is too long.' };
    return { valid: true, message: '' };
}

function buildPremiumModules(topic, level, goal) {
    const t = escapeHTML(topic);
    return [
        {
            title: `Foundations of ${topic}`,
            time: '5 min',
            content: `<p>Welcome to your mastery journey of <strong>${t}</strong>.</p>`,
            simplified: `<p>Simplified foundations.</p>`,
            quiz: {
                q: `What is the goal?`,
                options: [{ t: `A`, c: true }, { t: `B`, c: false }],
                exp: `Exp`
            }
        },
        {
            title: `Operational Mechanics`,
            time: '8 min',
            content: `<p>Mechanics of ${t}.</p>`,
            simplified: `<p>Simple mechanics.</p>`,
            quiz: {
                q: `How it works?`,
                options: [{ t: `A`, c: true }, { t: `B`, c: false }],
                exp: `Exp`
            }
        },
        {
            title: `Strategic Implementation`,
            time: '6 min',
            content: `<p>Strategy for ${t}.</p>`,
            simplified: `<p>Simple strategy.</p>`,
            quiz: {
                q: `Final step?`,
                options: [{ t: `A`, c: true }, { t: `B`, c: false }],
                exp: `Exp`
            }
        }
    ];
}

module.exports = {
    escapeHTML,
    validateTopic,
    buildPremiumModules
};
