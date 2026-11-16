# Functional Modules

| Module | Purpose and interaction | Frontend | Backend evidence |
|---|---|---|---|
| Authentication | Register an account or log in; the login response token is stored locally. | `Register.jsx`, `Login.jsx`, `ProtectedRoute.jsx`, `Navbar.jsx` | `/api/auth`, `authController`, `User`, `authMiddleware` |
| Profile | Create/update one profile per logged-in user; comma-separated skills become an array. | `Profile.jsx` | `/api/profile`, `profileController`, `Profile` |
| Dashboard | Aggregates dashboard, profile, resume-history, recommendation, and skill-gap requests; renders partial data if some requests fail. | `Dashboard.jsx` | `/api/dashboard`; also consumes other API groups |
| Career details | Select one of eight displayed careers and load its MongoDB career record. | `CareerDetails.jsx` | `/api/careers/:careerName`, `careerController`, `Career` |
| Learning path | Select a career and load skills, courses, projects, and resources. | `LearningPath.jsx` | `/api/learning-path/:careerName`, `learningPathController`, `LearningPath` |
| Career recommendations | Send the saved profile to Gemini indirectly and display structured recommendations. | `AIRecommendation.jsx` | `/api/ai/recommendation`, `aiController`, `geminiService` |
| AI advisor | Submit a question with profile context and display a text reply for the browser session. | `AIChat.jsx` | `/api/ai-chat`, `aiChatController`, `geminiService` |
| Alternate chat route | A second protected career-chat API produces `{ reply }`; no frontend call was found. | No observed caller | `/api/chat`, `chatController`, `geminiService` |
| Resume analyzer/history | Upload a PDF; extract text, request Gemini analysis, store it, and retrieve prior records. | `ResumeAnalyzer.jsx`, `ResumeHistory.jsx` | `/api/resume`, `resumeController`, `resumeAnalyzerService`, `ResumeAnalysis` |
| Skill-gap analysis | Gets Gemini recommendations, selects the highest match, compares profile skills to local requirements, then stores the analysis. | `SkillGap.jsx` | `/api/skill-gap`, `skillGapController`, `skillGapService`, `SkillGapAnalysis` |

The home page, navigation, footer, CSS, and icon component provide presentation and navigation. Static marketing text should not be treated as evidence of measured outcomes or external data provenance.
