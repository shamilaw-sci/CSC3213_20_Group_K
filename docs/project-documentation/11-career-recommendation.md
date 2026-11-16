# Career Recommendation

## Purpose and user flow

`AIRecommendation.jsx` calls the protected `GET /api/ai/recommendation` on page load or when the user selects “Generate Again.” It displays career cards with match percentage, reason, missing skills, and suggested learning roadmap, then links to Learning Path, Career Details, and AI Chat views.

The controller reads the authenticated user's `Profile`; without one it returns 404. It passes profile name, education, interest, skills, and career goal to `generateCareerRecommendation` and returns `{ recommendation }`.

## Result format

The Gemini prompt/schema requests an object with `recommendations`, with each item requiring:

- `career`: a canonical career title
- `matchPercentage`: integer
- `reason`: short string
- `missingSkills`: string array
- `suggestedLearningRoadmap`: string array

The visible card’s fields map to this response. Some expanded card fields (salary, future demand, detailed explanation, certifications, projects, and others) have UI fallbacks but are not required by the current server response schema. They must not be documented as guaranteed AI API fields.

## Career normalization

The canonical set contains eight titles: Software Engineer, Data Scientist, Cybersecurity Analyst, Cloud Engineer, AI/ML Engineer, Web Developer, DevOps Engineer, and Database Administrator. The service maps listed aliases, including “AI Engineer,” “Machine Learning Engineer,” “Cyber Security Analyst,” “Frontend Developer,” “Node.js Backend Developer,” “Full Stack Engineer,” and “Cloud Backend Engineer”; it also supports case-insensitive matching. Unrecognized recommendation careers are filtered out after JSON parsing.

Recommendation results are generated per request and no dedicated recommendation model is present, so persistence/history for recommendations: **not implemented in inspected source**.
