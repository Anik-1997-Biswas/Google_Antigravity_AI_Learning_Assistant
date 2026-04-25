// State Management
const state = {
    topic: '',
    level: '',
    currentModuleIndex: 0,
    modules: [],
    adaptations: 0,
    isSimplifying: false
};

// DOM Elements
const elements = {
    screens: {
        onboarding: document.getElementById('onboarding-screen'),
        dashboard: document.getElementById('dashboard-screen')
    },
    panels: {
        loading: document.getElementById('ai-loading'),
        lesson: document.getElementById('lesson-module'),
        quiz: document.getElementById('quiz-module'),
        completion: document.getElementById('completion-module')
    },
    nav: {
        topic: document.getElementById('nav-topic-display'),
        level: document.getElementById('nav-level-display')
    },
    sidebar: {
        list: document.getElementById('learning-path-list'),
        progressFill: document.getElementById('overall-progress'),
        progressText: document.getElementById('progress-text')
    },
    lesson: {
        badge: document.getElementById('module-badge'),
        title: document.getElementById('lesson-title'),
        content: document.getElementById('lesson-content'),
        btnSimplify: document.getElementById('btn-simplify'),
        btnReady: document.getElementById('btn-ready-quiz')
    },
    quiz: {
        question: document.getElementById('quiz-question'),
        options: document.getElementById('quiz-options'),
        feedback: document.getElementById('quiz-feedback'),
        actions: document.getElementById('quiz-actions'),
        btnNext: document.getElementById('btn-next-module')
    },
    completion: {
        topic: document.getElementById('completion-topic'),
        modulesCount: document.getElementById('stat-modules'),
        adaptationsCount: document.getElementById('stat-adaptations'),
        btnNew: document.getElementById('btn-new-topic')
    }
};

// Event Listeners
document.getElementById('onboarding-form').addEventListener('submit', handleOnboarding);
elements.lesson.btnSimplify.addEventListener('click', simplifyCurrentLesson);
elements.lesson.btnReady.addEventListener('click', showQuiz);
elements.quiz.btnNext.addEventListener('click', nextModule);
elements.completion.btnNew.addEventListener('click', resetApp);

// Functions
function handleOnboarding(e) {
    e.preventDefault();
    const topicInput = document.getElementById('topic-input').value.trim();
    const levelInput = document.querySelector('input[name="level"]:checked').value;
    
    if (!topicInput) return;

    state.topic = topicInput;
    state.level = levelInput;

    // Update Nav
    elements.nav.topic.innerHTML = `Learning: <strong>${escapeHTML(state.topic)}</strong>`;
    elements.nav.level.textContent = state.level.charAt(0).toUpperCase() + state.level.slice(1);

    // Switch Screens
    elements.screens.onboarding.classList.remove('active');
    setTimeout(() => {
        elements.screens.dashboard.classList.remove('hidden');
        elements.screens.dashboard.classList.add('active');
        generateCurriculum();
    }, 300);
}

function generateCurriculum() {
    // Show Loading
    hideAllPanels();
    elements.panels.loading.classList.remove('hidden');

    // Simulate AI API Call (delay)
    setTimeout(() => {
        // Mock Curriculum based on generic structure
        state.modules = [
            {
                title: `Introduction to ${state.topic}`,
                content: `
                    <p>Welcome to the first module of your journey into <strong>${state.topic}</strong>. As a ${state.level} learner, we'll start with the fundamental concepts.</p>
                    <p>Here are the key takeaways:</p>
                    <ul>
                        <li>Understanding the core definition.</li>
                        <li>Why ${state.topic} matters in the modern world.</li>
                        <li>Basic terminology.</li>
                    </ul>
                    <p>Take your time to digest this information. Whenever you're ready, we'll verify your understanding.</p>
                `,
                simplifiedContent: `
                    <p>Let's break <strong>${state.topic}</strong> down into simpler terms.</p>
                    <p>Imagine it like building a house. Before you build the walls, you need a strong foundation. That's what this module is about.</p>
                    <p>Key points:</p>
                    <ul>
                        <li>What is it? (The definition)</li>
                        <li>Why do we care? (The importance)</li>
                        <li>What words do we use? (The terms)</li>
                    </ul>
                `,
                quiz: {
                    question: `What is the primary goal of this introductory module?`,
                    options: [
                        { text: `To learn advanced techniques immediately.`, isCorrect: false },
                        { text: `To understand the fundamental concepts and terminology.`, isCorrect: true },
                        { text: `To skip to practical application.`, isCorrect: false }
                    ],
                    explanation: `Starting with fundamentals ensures a strong foundation before moving to complex topics.`
                }
            },
            {
                title: `Core Mechanics of ${state.topic}`,
                content: `
                    <p>Now that you have the basics down, let's explore how <strong>${state.topic}</strong> actually works.</p>
                    <p>The mechanics typically involve:</p>
                    <ul>
                        <li>Component interaction and systematic flow.</li>
                        <li>Standard practices and common patterns.</li>
                    </ul>
                    <p>It's crucial to grasp these mechanics as they form the basis for everything else.</p>
                `,
                simplifiedContent: `
                    <p>Let's make the mechanics simpler.</p>
                    <p>Think of it like a clock. There are many gears turning together to make the hands move. We are looking at those gears now.</p>
                    <ul>
                        <li>How parts work together.</li>
                        <li>Common ways things are done.</li>
                    </ul>
                `,
                quiz: {
                    question: `Why is it important to grasp the core mechanics?`,
                    options: [
                        { text: `Because they form the basis for everything else.`, isCorrect: true },
                        { text: `Because it's the only way to memorize terms.`, isCorrect: false },
                        { text: `Mechanics are actually not that important.`, isCorrect: false }
                    ],
                    explanation: `The mechanics are the underlying rules that govern the topic.`
                }
            },
            {
                title: `Practical Applications`,
                content: `
                    <p>In this final module, we bridge theory and practice for <strong>${state.topic}</strong>.</p>
                    <p>Applying what you've learned involves:</p>
                    <ul>
                        <li>Identifying real-world use cases.</li>
                        <li>Applying principles to solve problems.</li>
                        <li>Recognizing edge cases and limitations.</li>
                    </ul>
                    <p>You are now ready to apply your knowledge.</p>
                `,
                simplifiedContent: `
                    <p>Let's simplify application.</p>
                    <p>This is where you take the tool out of the toolbox and actually use it to fix something.</p>
                    <ul>
                        <li>Where is it used in real life?</li>
                        <li>How does it solve problems?</li>
                    </ul>
                `,
                quiz: {
                    question: `What is meant by 'bridging theory and practice'?`,
                    options: [
                        { text: `Reading more books about the topic.`, isCorrect: false },
                        { text: `Applying learned concepts to real-world situations.`, isCorrect: true },
                        { text: `Ignoring the theory completely.`, isCorrect: false }
                    ],
                    explanation: `Application is the act of using theoretical knowledge in practical scenarios.`
                }
            }
        ];

        renderSidebar();
        loadModule(0);
    }, 2000);
}

function renderSidebar() {
    elements.sidebar.list.innerHTML = '';
    state.modules.forEach((mod, index) => {
        const li = document.createElement('li');
        li.className = 'path-item';
        if (index === state.currentModuleIndex) li.classList.add('active');
        if (index < state.currentModuleIndex) li.classList.add('completed');
        
        li.innerHTML = `
            <div class="path-icon"><i class="fa-solid ${index < state.currentModuleIndex ? 'fa-check' : 'fa-book'}"></i></div>
            <div class="path-content">
                <h3>Module ${index + 1}</h3>
                <p>${mod.title}</p>
            </div>
        `;
        elements.sidebar.list.appendChild(li);
    });

    updateProgress();
}

function updateProgress() {
    const total = state.modules.length;
    const completed = state.currentModuleIndex;
    const percentage = Math.round((completed / total) * 100);
    
    elements.sidebar.progressFill.style.width = `${percentage}%`;
    elements.sidebar.progressText.textContent = `${percentage}% Completed`;
}

function hideAllPanels() {
    Object.values(elements.panels).forEach(panel => {
        panel.classList.add('hidden');
        panel.classList.remove('slide-in-up');
    });
}

function loadModule(index) {
    hideAllPanels();
    state.currentModuleIndex = index;
    state.isSimplifying = false;
    
    renderSidebar();

    const moduleData = state.modules[index];
    
    // Update Lesson UI
    elements.lesson.badge.textContent = `Module ${index + 1} of ${state.modules.length}`;
    elements.lesson.title.textContent = moduleData.title;
    elements.lesson.content.innerHTML = moduleData.content;
    
    // Reset buttons
    elements.lesson.btnSimplify.disabled = false;
    elements.lesson.btnSimplify.innerHTML = '<i class="fa-solid fa-down-long"></i> Simplify';

    elements.panels.lesson.classList.remove('hidden');
    // Trigger reflow for animation
    void elements.panels.lesson.offsetWidth;
    elements.panels.lesson.classList.add('slide-in-up');
}

function simplifyCurrentLesson() {
    if (state.isSimplifying) return;
    state.isSimplifying = true;
    state.adaptations++;

    const moduleData = state.modules[state.currentModuleIndex];
    
    elements.lesson.content.style.opacity = '0';
    
    setTimeout(() => {
        elements.lesson.content.innerHTML = `
            <div style="border-left: 4px solid var(--accent-tertiary); padding-left: 1rem; margin-bottom: 1rem;">
                <small style="color: var(--accent-tertiary); text-transform: uppercase; font-weight: bold;">Simplified View</small>
            </div>
            ${moduleData.simplifiedContent}
        `;
        elements.lesson.content.style.opacity = '1';
        elements.lesson.btnSimplify.disabled = true;
        elements.lesson.btnSimplify.innerHTML = '<i class="fa-solid fa-check"></i> Simplified';
    }, 300);
}

function showQuiz() {
    hideAllPanels();
    
    const moduleData = state.modules[state.currentModuleIndex];
    const quizData = moduleData.quiz;

    elements.quiz.question.textContent = quizData.question;
    elements.quiz.options.innerHTML = '';
    elements.quiz.feedback.classList.add('hidden');
    elements.quiz.actions.classList.add('hidden');

    quizData.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'quiz-option';
        div.innerHTML = `
            <div class="option-indicator">${String.fromCharCode(65 + idx)}</div>
            <div class="option-text">${escapeHTML(opt.text)}</div>
        `;
        div.addEventListener('click', () => handleQuizAnswer(div, opt, quizData.explanation));
        elements.quiz.options.appendChild(div);
    });

    elements.panels.quiz.classList.remove('hidden');
    void elements.panels.quiz.offsetWidth;
    elements.panels.quiz.classList.add('slide-in-up');
}

function handleQuizAnswer(selectedDiv, optionData, explanation) {
    // Disable all options
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.classList.remove('selected', 'correct', 'incorrect');
    });

    selectedDiv.classList.add('selected');

    setTimeout(() => {
        elements.quiz.feedback.classList.remove('hidden', 'success', 'error');
        
        if (optionData.isCorrect) {
            selectedDiv.classList.add('correct');
            elements.quiz.feedback.classList.add('success');
            elements.quiz.feedback.innerHTML = `<strong>Correct!</strong> ${explanation}`;
            elements.quiz.actions.classList.remove('hidden');
            
            // Check if it's the last module
            if (state.currentModuleIndex === state.modules.length - 1) {
                elements.quiz.btnNext.innerHTML = 'Complete Journey <i class="fa-solid fa-trophy"></i>';
            } else {
                elements.quiz.btnNext.innerHTML = 'Next Module <i class="fa-solid fa-arrow-right"></i>';
            }

        } else {
            selectedDiv.classList.add('incorrect');
            elements.quiz.feedback.classList.add('error');
            elements.quiz.feedback.innerHTML = `<strong>Not quite.</strong> Let's review the material and try again.`;
            
            // Adapt if they fail
            state.adaptations++;
            
            // Add a "Review Concept" button to go back
            elements.quiz.actions.innerHTML = `<button id="btn-review" class="secondary-btn"><i class="fa-solid fa-rotate-left"></i> Review Concept</button>`;
            elements.quiz.actions.classList.remove('hidden');
            document.getElementById('btn-review').addEventListener('click', () => {
                // Restore next button for later
                elements.quiz.actions.innerHTML = `<button id="btn-next-module" class="primary-btn">Next Module <i class="fa-solid fa-arrow-right"></i></button>`;
                elements.quiz.btnNext = document.getElementById('btn-next-module');
                elements.quiz.btnNext.addEventListener('click', nextModule);
                loadModule(state.currentModuleIndex);
                if(!state.isSimplifying) simplifyCurrentLesson(); // Auto-simplify on review
            });
        }
    }, 500);
}

function nextModule() {
    if (state.currentModuleIndex < state.modules.length - 1) {
        loadModule(state.currentModuleIndex + 1);
    } else {
        showCompletion();
    }
}

function showCompletion() {
    hideAllPanels();
    state.currentModuleIndex++; // To make progress 100%
    renderSidebar();

    elements.completion.topic.textContent = state.topic;
    elements.completion.modulesCount.textContent = state.modules.length;
    elements.completion.adaptationsCount.textContent = state.adaptations;

    elements.panels.completion.classList.remove('hidden');
    void elements.panels.completion.offsetWidth;
    elements.panels.completion.classList.add('slide-in-up');
}

function resetApp() {
    state.topic = '';
    state.level = '';
    state.currentModuleIndex = 0;
    state.modules = [];
    state.adaptations = 0;
    
    document.getElementById('topic-input').value = '';
    elements.screens.dashboard.classList.remove('active');
    elements.screens.dashboard.classList.add('hidden');
    elements.screens.onboarding.classList.add('active');
    
    // Reset Next Button just in case
    elements.quiz.actions.innerHTML = `<button id="btn-next-module" class="primary-btn">Next Module <i class="fa-solid fa-arrow-right"></i></button>`;
    elements.quiz.btnNext = document.getElementById('btn-next-module');
    elements.quiz.btnNext.addEventListener('click', nextModule);
}

// Utils
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
