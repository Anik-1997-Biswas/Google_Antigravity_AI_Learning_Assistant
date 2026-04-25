# Lumina Learn — Premium AI Learning Assistant

> **Lumina Learn** is a state-of-the-art, adaptive educational platform that personalizes learning journeys in real-time. Designed with a premium "Glassmorphism" aesthetic, it leverages AI-driven logic to adjust content difficulty based on user goals and performance.

[![Deploy to Cloud Run](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)

---

## 💎 Premium Features

- **Adaptive Curriculum** — Modules dynamically tailored to your **Topic**, **Skill Level**, and **Learning Goal**.
- **Gamified Experience** — Earn **XP (Experience Points)** for mastery and maintain a **Day Streak** to stay motivated.
- **Visual Excellence** — Immersive UI featuring an animated background grid, radial masks, and floating glass panels.
- **Smart Simplification** — "Wand Sparkle" feature to simplify complex topics into easy-to-digest building blocks.
- **Certificate of Mastery** — Achieve 100% completion to unlock a high-fidelity, printable certificate.
- **Time Estimates** — Integrated reading time estimates for every module to help you plan your study sessions.

---

## 🛠 Tech Stack & Best Practices

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| **Frontend**   | Vanilla HTML5, CSS3 (Modern Flex/Grid), JS (ES2022) |
| **Design**     | Glassmorphism, CSS Variables, Staggered Animations |
| **Typography** | Google Fonts: `Inter` & `Outfit`                |
| **Icons**      | Font Awesome 6 (Pro Icons)                      |
| **Analytics**  | **Google Analytics 4 (GA4)**                    |
| **Security**   | Content Security Policy (CSP), XSS Sanitization |
| **Deployment** | **Google Cloud Run**, Docker, Nginx Alpine      |

---

## 📊 Google Services Integration

### 1. Google Analytics 4 (GA4)
Lumina Learn is fully instrumented with GA4 to track learning progress.
- **Custom Events Tracked:**
    - `onboarding_complete`: Tracks user topics, levels, and goals.
    - `module_load`: Monitors lesson engagement.
    - `lesson_simplified`: Measures content adaptation needs.
    - `quiz_answered`: Tracks mastery accuracy.
    - `journey_complete`: Final conversion point.
    - `certificate_viewed`: User achievement engagement.

### 2. Google Fonts
Optimized delivery using `preconnect` and `display: swap` for maximum performance and zero FOIT (Flash of Invisible Text).

### 3. Google Cloud Run
Fully containerized for **serverless deployment**. Optimized for auto-scaling and low-latency global delivery.

---

## 🚀 Getting Started

### Local Development
Open `index.html` in your browser, or use a simple server:
```bash
# Using Python
python -m http.server 8080
```

### Running Tests
Lumina Learn includes a built-in, zero-dependency test suite to ensure core logic integrity.
- **Run Tests:** Open `tests/index.html` and click **"Run All Tests"**.
- **Coverage:** Includes `escapeHTML` (Security), `validateTopic` (Validation), `buildModules` (Logic), and `calcProgress` (Math).

---

## 🐳 Docker Deployment

Lumina Learn uses a hardened Nginx configuration with production-grade security headers.

```bash
# Build the image
docker build -t lumina-learn .

# Run locally
docker run -p 8080:8080 lumina-learn
```

### Deploying to Google Cloud Run
```bash
# 1. Tag the image
docker tag lumina-learn gcr.io/[PROJECT_ID]/lumina-learn

# 2. Push to Google Container Registry
docker push gcr.io/[PROJECT_ID]/lumina-learn

# 3. Deploy
gcloud run deploy lumina-learn --image gcr.io/[PROJECT_ID]/lumina-learn --platform managed
```

---

## ♿ Accessibility & Standards
- **WCAG 2.1 AA Compliant**: All interactive elements are keyboard accessible.
- **Reduced Motion**: Respects the `prefers-reduced-motion` system setting.
- **Semantic HTML**: Uses appropriate `<main>`, `<article>`, and `<nav>` tags for SEO and assistive tech.
- **ARIA Live Regions**: Dynamic updates are announced to screen readers in real-time.

---

## 📄 License
MIT © 2026 Lumina AI Education Systems.
