# Frontend Documentation

## Application structure

React is mounted under `StrictMode` and `BrowserRouter`. `App.jsx` defines public routes `/`, `/login`, and `/register`; protected routes are `/dashboard`, `/career-details`, `/learning-path`, `/learning-path/:career`, `/ai-recommendation`, `/skill-gap`, `/ai-chat`, `/resume-analyzer`, `/resume-history`, and `/profile`. Unmatched paths redirect to `/`.

`ProtectedRoute` redirects to Login when `localStorage.token` is absent. It does not inspect expiration or validate the JWT itself. Authenticated pages use shared `Navbar` and `Footer` components; navigation includes dashboard, career details, learning path, AI recommendation, skill gap, advisor, resume functions, and profile.

## Pages and API communication

| Page | Actual API use | Local state / visible states |
|---|---|---|
| Login / Register | Auth login/register | controlled form, loading button, error/success message |
| Profile | GET/POST profile | controlled profile form, loading, saving, success/error |
| Dashboard | five endpoints listed in `14` | aggregate loading skeleton, partial-data error |
| Career Details | GET career by selected title | selected career, loading, error |
| Learning Path | GET path by selected/URL career | selected career, loading, error |
| AI Recommendation | GET recommendation | recommendations, loading, profile-needed/error, expanded cards |
| AI Chat | POST ai-chat | in-memory messages, loading, retry/error, `aiChatCount` |
| Resume Analyzer | POST multipart resume | selected file, drag state, upload percentage, analysis/error |
| Resume History | GET resume history | loading, empty state, error |
| Skill Gap | GET skill gap | loading, profile-needed/error, result |

Axios URLs are hard-coded to `http://localhost:5000`; no centralized API client or frontend environment-based API base URL was found. Pages normally include an Authorization header and remove the token after 401.

## Responsive and accessibility evidence

The CSS source contains `@media` rules across application, page, and navigation styles. Navbar behavior explicitly includes a mobile menu, overlay, Escape-key closing, close-on-route-change, and body-scroll locking while open. JSX also includes labels, `aria-*` attributes, alert/status roles, loading live regions, semantic buttons/links, and visible loading/error/empty states in major data pages. Exact breakpoint coverage and device testing: **Requires confirmation**.

## State management

State is component-local React hook state (`useState`, `useEffect`, `useCallback`, `useMemo`, refs) plus `localStorage` for token and chat count. No Redux, Context provider, Zustand, or comparable shared-state library is imported in the inspected source.
