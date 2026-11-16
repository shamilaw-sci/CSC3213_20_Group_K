# API Documentation

Base URL in frontend source: `http://localhost:5000`. Except where shown as public, protected routes require `Authorization: Bearer <JWT>` and return `401` with `{ message: "No token" }` or `{ message: "Invalid token" }` from middleware.

| Method and endpoint | Auth | Input | Success response / controller | Important evidenced errors |
|---|---|---|---|---|
| `GET /` | No | none | Plain `AI Career Guidance API Running...` | none shown |
| `POST /api/auth/register` | No | JSON `name`, `email`, `password` | 201 `{ message }`; `registerUser` | 400 missing fields/existing user; 500 `{ message }` |
| `POST /api/auth/login` | No | JSON `email`, `password` | 200 `{ message, token }`; `loginUser` | 400 user not found/invalid password; 500 |
| `GET /api/profile` | Yes | none | Profile document or `null`; `getProfile` | 401; 500 |
| `POST /api/profile` | Yes | JSON profile fields | Updated/created profile; `createProfile` | 401; 500 |
| `GET /api/dashboard` | Yes | none | `{ message, name, email, totalRecommendations }`; `getDashboard` | 401; 500 |
| `GET /api/careers/:careerName` | No middleware | path career name | Career document; `getCareerDetails` | 404 career not found; 500 |
| `GET /api/learning-path/:careerName` | No middleware | path career name | LearningPath document; `getLearningPath` | 404 path not found; 500 |
| `GET /api/ai/recommendation` | Yes | none; saved profile used | `{ recommendation }`; `getAIRecommendation` | 404 profile; 503 AI unavailable; 500 |
| `POST /api/ai-chat` | Yes | JSON nonblank `message` | `{ response }`; `chatWithAI` | 400; 404 profile; 503 AI unavailable; 500 |
| `POST /api/chat` | Yes | JSON nonblank `message` | `{ reply }`; `chatWithCareerAI` | 400; 404 profile; 500 generic failure |
| `POST /api/resume/analyze` | Yes | multipart `resume` PDF | Gemini analysis object; `analyzeResume` | 400 missing/non-PDF/over 5 MB/unreadable; 503 AI unavailable; 500 |
| `GET /api/resume/history` | Yes | none | `{ history: ResumeAnalysis[] }`; `getResumeHistory` | 401; 500 |
| `GET /api/skill-gap` | Yes | none; profile used | skill-gap object; `getSkillGap` | 404 profile; 422 no/unsupported recommendation; 503 AI unavailable; 500 |

The resume multipart field must be named `resume`. The profile controller destructures `name`, `email`, `interest`, `skills`, `education`, and `careerGoal`; schema validation only requires `userId`, so frontend required-field rules are not equivalent to backend field requirements.
