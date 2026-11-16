# Documentation Evidence

| Documentation Topic | Repository Evidence | File(s) | Confidence |
|---|---|---|---|
| Stack and scripts | Package manifests declare React/Vite/Axios and Express/Mongoose/Gemini/PDF dependencies and scripts. | `frontend/package.json`, `backend/package.json`, `package.json` | High |
| Server route mounting | Express server mounts ten `/api` route groups and configures CORS/JSON. | `backend/server.js` | High |
| MongoDB connection | Mongoose connects through environment URI with optional direct fallback. | `backend/config/db.js` | High for code; runtime connection Requires confirmation |
| Auth registration/login | bcrypt hash/compare, JWT sign for one day, user schema constraints. | `backend/controllers/authController.js`, `backend/models/User.js` | High |
| Protected API validation | Bearer parsing and `jwt.verify`; applied imports/routes establish protected groups. | `backend/middleware/authMiddleware.js`, route files | High |
| Client auth behavior | Token stored/removed in localStorage; route guard checks presence. | `Login.jsx`, `ProtectedRoute.jsx`, `Navbar.jsx` | High |
| Profile behavior | Upsert keyed by unique `userId`; frontend comma-split skills. | `profileController.js`, `Profile.js`, `Profile.jsx` | High |
| Career/learning persistence | Controllers query `Career`/`LearningPath`; models define fields. | controllers and models for Career/LearningPath | High |
| Career/learning data population | No import of static data modules found in scanned app source. | `backend/data/*.js`; source reference scan | High: population Requires confirmation |
| Gemini recommendation | Prompt, model selection, response schema, JSON parse and canonical normalization. | `backend/services/geminiService.js`, `careerUtils.js` | High |
| Gemini chat | Profile-aware prompt and plain-text generated response. | `backend/services/geminiService.js`, chat controllers | High |
| Resume processing | Multer rules, PDF extraction, Gemini structured schema, save/history and cleanup attempt. | `resumeRoutes.js`, `resumeController.js`, `resumeAnalyzerService.js`, `ResumeAnalysis.js` | High |
| Skill-gap algorithm | Required lists, normalized comparison, readiness formula, persistence. | `skillGapController.js`, `skillGapService.js`, `SkillGapAnalysis.js` | High |
| Dashboard aggregation | Five `Promise.allSettled` calls and local calculations. | `frontend/src/pages/Dashboard.jsx` | High |
| Frontend routes/UI states | React Router routes, page requests, component state, CSS `@media` rules. | `App.jsx`, page JSX, CSS files | High for source; visual/device behavior Requires confirmation |
| Automated test evidence | No common test/spec filename found; no `test` script declared. | repository file scan; package manifests | High for absence in scan; test execution Requires confirmation |
| Deployment/security posture | No deployment docs/config or explicit CORS restriction, TLS, rate limit, RBAC, etc. | README files, `server.js`, route/middleware files | Requires confirmation |
