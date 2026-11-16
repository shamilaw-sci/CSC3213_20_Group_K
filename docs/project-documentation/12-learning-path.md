# Learning Path

## Purpose and frontend behavior

The protected Learning Path page displays eight selectable career tracks. It initializes from an optional `/learning-path/:career` parameter when it matches a listed career case-insensitively; otherwise it defaults to Software Engineer. When the selection changes, it requests `GET /api/learning-path/:careerName` and displays `skills`, `courses`, `projects`, and `resources` in separate cards with loading/error states.

Supported frontend choices are Software Engineer, Data Scientist, Cybersecurity Analyst, Cloud Engineer, AI/ML Engineer, Web Developer, DevOps Engineer, and Database Administrator.

## API/model interaction

`learningPathRoutes.js` routes the GET request to `getLearningPath`, which performs `LearningPath.findOne({ career: req.params.careerName })`. It responds with the matching document or 404 `{ message: "Learning path not found" }`. The model fields are strings/arrays: `career`, `skills`, `courses`, `projects`, and `resources`.

Although the frontend includes a Bearer header, the route does not attach backend authentication middleware. The React route itself is wrapped in `ProtectedRoute`, so token presence is still required to reach the page through normal client routing.

## Data qualification

`backend/data/learningPathData.js` defines a static object for the same careers with skills, courses, and projects (and no resource arrays), but no import of that file was found in the scanned frontend/backend source. It therefore cannot be treated as proof of live API data or a database seed. How `LearningPath` documents are populated, and whether resources are available in production: **Requires confirmation**.
