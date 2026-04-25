# Lumina Learn — AI Learning Assistant

> An intelligent, adaptive learning companion that personalises lessons in real-time based on your skill level and quiz performance.

[![Deploy to Cloud Run](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)

---

## Features

- **Adaptive Curriculum** — Dynamically generated modules tailored to your chosen topic and level (Beginner / Intermediate / Advanced).
- **Concept Checks** — Quiz after every module with instant feedback and score tracking.
- **Simplify on Demand** — One-click lesson simplification when the content feels too complex.
- **Full Keyboard Navigation** — WCAG 2.1 AA compliant; all interactions accessible without a mouse.
- **Google Analytics 4** — Session events tracked for curriculum starts, quiz answers, and journey completions.
- **Cloud Run Ready** — Containerised with nginx, production security headers, and gzip compression.

---

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | Vanilla HTML5, CSS3, JavaScript (ES2020, strict mode) |
| Fonts      | Google Fonts — Inter & Outfit    |
| Icons      | Font Awesome 6                   |
| Analytics  | **Google Analytics 4 (gtag.js)** |
| Container  | Docker + nginx:1.25-alpine       |
| Hosting    | **Google Cloud Run**             |

---

## Google Services Integration

### 1. Google Fonts
`Inter` and `Outfit` are loaded via the Google Fonts API with `preconnect` hints for optimal performance:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Outfit:wght@400;800&display=swap" rel="stylesheet">
```

### 2. Google Analytics 4
Events are tracked throughout the learning journey:

| GA4 Event                     | Trigger                              |
|-------------------------------|--------------------------------------|
| `curriculum_generation_started` | User submits onboarding form         |
| `curriculum_generated`          | Modules are loaded                   |
| `lesson_started`                | Each new module loads                |
| `lesson_simplified`             | User clicks Simplify                 |
| `quiz_started`                  | Quiz panel opens                     |
| `quiz_answered`                 | User selects an answer               |
| `journey_complete`              | All modules finished                 |
| `app_reset`                     | User starts a new topic              |

**Setup:** Replace `G-XXXXXXXXXX` in `index.html` with your real GA4 Measurement ID from [Google Analytics](https://analytics.google.com/).

### 3. Google Cloud Run
The app is containerised and designed to run on **Google Cloud Run** — fully managed, auto-scaling, serverless.

---

## Local Development

Open `index.html` directly in any modern browser — no build step required.

```bash
# Or serve with Python
python -m http.server 8080

# Or with Node
npx serve .
```

---

## Docker Build & Run

```bash
# Build the image
docker build -t lumina-learn:latest .

# Run locally on port 8080
docker run -p 8080:8080 lumina-learn:latest

# Open in browser
open http://localhost:8080
```

---

## Deploy to Google Cloud Run

### Prerequisites
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
- A Google Cloud project with billing enabled
- Cloud Run and Container Registry APIs enabled

### Step 1 — Authenticate
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 2 — Build & Push to Google Artifact Registry
```bash
# Create repository (first time only)
gcloud artifacts repositories create lumina-learn \
  --repository-format=docker \
  --location=us-central1

# Build and push
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/lumina-learn/app:latest .
```

### Step 3 — Deploy to Cloud Run
```bash
gcloud run deploy lumina-learn \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/lumina-learn/app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --min-instances 0 \
  --max-instances 10
```

### Step 4 — View your live URL
```
Service URL: https://lumina-learn-xxxx-uc.a.run.app
```

---

## Running Tests

Open the test suite in your browser — no install needed:

```
tests/index.html
```

Click **Run All Tests**. You should see **30 tests passing** across 4 suites:

| Suite             | Tests |
|-------------------|-------|
| `escapeHTML()`    | 10    |
| `validateTopic()` | 7     |
| `buildModules()`  | 10    |
| `calcProgress()`  | 5     |

---

## Accessibility

- **WCAG 2.1 AA** compliant
- All radio buttons keyboard-focusable (`.visually-hidden`, not `display:none`)
- `aria-live` regions announce state changes to screen readers
- `:focus-visible` rings on all interactive elements
- `prefers-reduced-motion` respected for users who opt out of animation
- `role="alert"` on quiz feedback for immediate screen reader announcement
- Colour contrast ≥ 4.5:1 for all body text

---

## Security

- **Content Security Policy** meta tag restricts resource origins
- All user input sanitised via `escapeHTML()` before DOM insertion
- `textContent` used instead of `innerHTML` for all user-derived data
- nginx serves `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` headers
- Docker image uses pinned `nginx:1.25-alpine` base

---

## Project Structure

```
ai-learning-assistant/
├── index.html        # Main HTML — CSP, GA4, ARIA, semantic structure
├── styles.css        # Design system — tokens, glassmorphism, a11y utilities
├── app.js            # Application logic — strict mode, JSDoc, GA4 events
├── nginx.conf        # Production nginx — security headers, gzip, caching
├── Dockerfile        # Container — nginx:1.25-alpine, HEALTHCHECK, labels
├── .dockerignore     # Excludes .git, tests, docs from image
└── tests/
    └── index.html    # Zero-dependency in-browser test runner (30 tests)
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
