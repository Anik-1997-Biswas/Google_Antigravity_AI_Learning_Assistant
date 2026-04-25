const test = require('node:test');
const assert = require('node:assert');

// Mocking logic for testing purely mathematical/string utilities
const utils = {
    calculateProgress: (current, total) => {
        if (total === 0) return 0;
        return Math.round((current / total) * 100);
    },
    sanitizeTopic: (topic) => {
        return topic.trim().slice(0, 100);
    },
    validateLevel: (level) => {
        return ['beginner', 'intermediate', 'advanced'].includes(level);
    }
};

test('Utility: Progress Calculation', () => {
    assert.strictEqual(utils.calculateProgress(1, 4), 25);
    assert.strictEqual(utils.calculateProgress(0, 3), 0);
    assert.strictEqual(utils.calculateProgress(3, 3), 100);
});

test('Utility: Topic Sanitization', () => {
    assert.strictEqual(utils.sanitizeTopic('  Python  '), 'Python');
    assert.strictEqual(utils.sanitizeTopic('A'.repeat(120)).length, 100);
});

test('Utility: Level Validation', () => {
    assert.strictEqual(utils.validateLevel('beginner'), true);
    assert.strictEqual(utils.validateLevel('pro'), false);
});
