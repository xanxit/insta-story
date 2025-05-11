# Insta-Story React App

## 🚀 Live Demo

Try it out here: [https://insta-story-ten.vercel.app/](https://insta-story-ten.vercel.app/)

---

## 📦 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher

### Installation

1. Clone the repo
   ```bash
   git clone [https://github.com/your-username/insta-story.git](https://github.com/your-username/insta-story.git)
   cd insta-story
   ```
2. Install dependencies
   ```bash
   npm install or yarn
   ```
3. Start the development server
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173.

### End-to-End Tests

We use Playwright for E2E testing.

- **Run all tests (headless)**
  ```bash
  npm run test:e2e
  ```
- **Run tests in headed mode\*\***
  ```bash
  npm run test:e2e:headed
  ```
- **View HTML report**
  ```bash
  npm run test:e2e:report
  ```

## ⚙️ Design & Architecture

### Component Structure

- **`App`**: Top-level state, theme toggle, navigation between `<StoryList>` and `<StoryViewer>` (or `<PunScreen>`).
- **`StoryList`**: Displays thumbnails and handles file uploads.
- **`StoryViewer`**: Full-screen story viewer with progress bar, manual & auto-advance.
- **`PunScreen`**: Lightweight "joke" overlay when you upload (with a "hire me" call-to-action).

### Performance Optimizations

- **`useMemo`** for sorting stories so we only recompute when the underlying data changes.
- **`useCallback`** to stabilize handler references and avoid unnecessary re-renders.
- **Vite** for lightning-fast hot module replacement and lean production bundles (via Rollup under the hood).
- **SessionStorage** for minimal persistence—no heavy client-side database or global state library.

### Scalability Considerations

- **Modular components**: each feature lives in its own file under `src/components`, easy to maintain or extract.
- **Configurable durations**: test hooks override timing via `window.__STORY_DURATION`, so adding new animations or story behaviors remains testable.
- **Decoupled styling**: CSS per-component and CSS variables for theming allow easy design updates or brand changes.
- **E2E coverage** with Playwright ensures that as new features (e.g. comments, reactions) are added, regressions are caught early.
