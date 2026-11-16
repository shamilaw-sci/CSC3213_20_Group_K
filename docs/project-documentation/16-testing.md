# Testing Evidence

## Automated tests

No test files were found by common test/spec filename conventions in the tracked repository scan, and neither package manifest provides a `test` script. Therefore, no automated test suite, test execution, coverage result, or passing status can be claimed from this audit.

The frontend does define a `lint` script (`eslint .`), but there is no audit evidence that it was run successfully. The backend has a `dev` script only.

## Manual verification supported by source inspection

The following are code paths that can be manually verified, not completed test results:

- Registration validation, duplicate-email response, login, token storage, logout, and protected-route redirect.
- Profile creation/update and profile-required responses for AI features.
- Career and learning-path retrieval after their MongoDB documents exist.
- Recommendation, AI chat, resume analysis, and skill-gap flows when MongoDB and Gemini are configured.
- PDF rejection for non-PDF files, PDFs over 5 MB, and PDFs without readable text.
- Resume-analysis history ordering and dashboard data rendering.
- Mobile navigation/menu behavior and page loading/error/empty states.

## Unverified areas

Database connectivity, Gemini account/model availability, response schema behavior under real calls, temporary-file cleanup in a deployed environment, API authorization enforcement, cross-browser behavior, responsive layouts at defined breakpoints, performance, accessibility testing, security testing, and production deployment all **require confirmation**.
