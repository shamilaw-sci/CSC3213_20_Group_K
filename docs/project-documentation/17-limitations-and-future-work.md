# Limitations and Future Work

This document separates observed gaps from proposed improvements. None of the proposed items are claimed as existing features.

## Observed limitations or ambiguities

- The root README is minimal and the frontend README is the default Vite template; setup, deployment, and operational documentation are absent.
- No automated test suite or test script is evidenced.
- Gemini-dependent features fail when configuration/service access is unavailable; outputs are generated per request and no accuracy evaluation is documented.
- Career and LearningPath collections are queried, but the scanned source contains no seed/import path. Static `data` modules are not imported.
- Career details and learning-path API routes lack backend JWT middleware even though their React pages are client-protected.
- Token storage is browser `localStorage`, with token existence—not validity—used by the route guard.
- The dashboard triggers recommendation and skill-gap generation during its aggregate load; this may make dashboard availability dependent on Gemini.
- Skill-gap priority equals the missing-skill list and does not apply a separate ordering/ranking method.
- Resume history stores no filename/raw resume text under the observed schema, and chat messages are not stored server-side.
- CORS uses default middleware configuration; no explicit origin policy is shown.

## Future work candidates

- Add a documented environment/setup guide, deployment architecture, and a verified data seed/migration process.
- Add unit, integration, and end-to-end tests plus recorded CI/test evidence.
- Centralize configurable frontend API base URLs and document supported environments.
- Apply consistent server-side authorization to routes intended to be private; evaluate safer token-storage and token-lifecycle approaches.
- Add validation and observability around Gemini output, graceful fallback behavior, and evaluation criteria.
- Add persistent recommendation/chat history only if project requirements call for it.
- Define skill priority using transparent, validated criteria if a ranked learning plan is required.
- Add security controls appropriate to deployment, such as explicit CORS policy, rate limiting, input/file security review, HTTPS, and logging policy.

Whether these changes are in scope for the university project: **Requires confirmation**.
