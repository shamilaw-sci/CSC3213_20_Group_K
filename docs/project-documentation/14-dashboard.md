# Dashboard

## Purpose and behavior

The protected Dashboard page provides a combined view of profile completion, latest resume analysis, top AI recommendation, skill-gap results, locally counted chat usage, and navigation shortcuts.

## Requests and data mapping

On mount, `Dashboard.jsx` uses `Promise.allSettled` for five bearer-authenticated requests:

| Request | Dashboard use |
|---|---|
| `GET /api/dashboard` | Welcome name and server-returned fields |
| `GET /api/profile` | Profile completion and fallback name |
| `GET /api/resume/history` | First (newest) analysis, ATS score, strengths, missing skills, course count |
| `GET /api/ai/recommendation` | Highest numeric match percentage and career/reason |
| `GET /api/skill-gap` | Career, readiness, current skills, missing skills |

The backend dashboard controller itself only reads `User` and returns `{ message, name, email, totalRecommendations: 5 }`. The fixed `totalRecommendations` value is not displayed by the observed Dashboard JSX and its basis is not established in source.

## Loading/error behavior

The page renders skeleton placeholders while the aggregate load is pending. Any 401 among rejected calls clears the token and redirects to Login. Other individual rejections fall back to default values so cards can still render; a visible partial-load error is set only when the dashboard endpoint itself fails. This means AI and database requests may be triggered automatically when opening the dashboard.

## Calculated client values

Profile completion is the percentage of four truthy values: `education`, `interest`, `careerGoal`, and a non-empty `skills` array. Top recommendation is the highest `matchPercentage` after sorting a copied array. AI conversation count is browser-local `aiChatCount`, not a backend count.
