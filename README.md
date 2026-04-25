# Lumina - AI Learning Companion

Lumina is an intelligent, highly interactive single-page web application designed to help users deeply understand new concepts in a personalized way. It simulates an AI-driven learning experience by generating customized curriculums, providing interactive content, and assessing understanding through quizzes.

## Features

- **Personalized Onboarding:** Users can specify any topic they want to learn and their current skill level (Beginner, Intermediate, Advanced).
- **Dynamic Learning Paths:** A simulated AI instantly generates a curriculum with structured modules tailored to the user's level.
- **Adaptive Explanations (Simplify):** If a concept is too complex, users can click the "Simplify" button to instantly receive an alternative, easier-to-understand breakdown of the lesson.
- **Diagnostic Quizzes:** Each module concludes with a concept check. Incorrect answers trigger helpful feedback and encourage the user to review the material, keeping the learning pace engaging and effective.
- **Progress Tracking:** A visual sidebar updates dynamically to show the user's progress through the learning path.
- **Premium UI:** Designed with modern web standards, featuring dark mode, glassmorphism UI elements, smooth micro-animations, and dynamic background gradients.

## Tech Stack

This project is built purely with web fundamentals to ensure maximum portability and performance without external build dependencies:

- **HTML5:** Semantic structure and accessible layouts.
- **CSS3:** Custom properties (variables), Flexbox/Grid layouts, keyframe animations, and glassmorphic aesthetics.
- **Vanilla JavaScript:** State management, DOM manipulation, simulated AI api calls, and interactive logic.
- **Font Awesome:** Iconography.
- **Google Fonts:** Inter (sans-serif) and Outfit (display).

## How to Run

Because this is a completely self-contained frontend application, there is no need for `npm install` or any complex server setups.

1. Clone or download this repository.
2. Navigate to the `ai-learning-assistant` folder.
3. Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

*Alternatively, if you prefer to run it through a local server, you can use tools like Live Server in VS Code, or Python's HTTP server (`python -m http.server 8000`).*

## File Structure

- `index.html`: The main markup for the application including onboarding, dashboard, and completion screens.
- `styles.css`: All styling rules, animations, and responsive design media queries.
- `app.js`: The application logic handling state, navigation, curriculum generation simulation, and quiz grading.

## Future Enhancements
- Integration with a real LLM API (like Gemini or OpenAI) to generate completely unscripted, highly detailed dynamic content.
- LocalStorage integration to save user progress and past curriculums across browser sessions.
- Audio narration for accessibility.
