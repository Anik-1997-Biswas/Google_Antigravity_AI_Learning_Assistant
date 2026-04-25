/**
 * @jest-environment jsdom
 */

const { 
    escapeHTML, 
    validateTopic, 
    buildPremiumModules 
} = require('./app_logic_clone'); // We'll export these from a logic file

describe('Lumina Learn Core Logic', () => {
    
    test('Security: escapeHTML should neutralize script tags', () => {
        const input = '<script>alert("xss")</script>';
        const escaped = escapeHTML(input);
        expect(escaped).not.toContain('<script>');
        expect(escaped).toContain('&lt;script&gt;');
    });

    test('Validation: validateTopic should reject empty strings', () => {
        const result = validateTopic('   ');
        expect(result.valid).toBe(false);
    });

    test('Validation: validateTopic should accept valid topics', () => {
        const result = validateTopic('Quantum Computing');
        expect(result.valid).toBe(true);
    });

    test('Content: buildPremiumModules should return 3 modules', () => {
        const modules = buildPremiumModules('Math', 'Beginner', 'Curiosity');
        expect(modules).toHaveLength(3);
        expect(modules[0].title).toContain('Math');
    });

    test('Logic: modules should have necessary properties', () => {
        const modules = buildPremiumModules('Biology', 'Advanced', 'Mastery');
        expect(modules[0]).toHaveProperty('title');
        expect(modules[0]).toHaveProperty('content');
        expect(modules[0]).toHaveProperty('quiz');
    });
});
