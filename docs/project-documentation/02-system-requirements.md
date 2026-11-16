# System Requirements

## Software components evidenced in package manifests

The frontend package exposes `dev`, `build`, `lint`, and `preview` scripts through Vite. The backend exposes only `dev`, which runs `nodemon server.js`. The root package manifest lists shared-looking dependencies but no scripts.

| Component | Evidenced requirement |
|---|---|
| Frontend runtime/build | Node.js environment capable of running Vite and the declared frontend dependencies |
| Backend runtime | Node.js environment capable of Express/CommonJS and the declared backend dependencies |
| Database | Reachable MongoDB connection string supplied through environment configuration |
| AI functions | Gemini API key supplied through environment configuration |
| Resume analysis | Writable `backend/uploads/resumes` directory; PDF upload no larger than 5 MB |
| Browser | JavaScript-enabled browser with `localStorage` and file-upload support |

## Configuration evidenced by code

The code reads `PORT` (with `5000` fallback), `MONGO_URI`, optional `MONGO_DIRECT_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and optional `GEMINI_MODEL` (default `gemini-3.5-flash`). This package intentionally does not record values or inspect `.env` files.

## Functional prerequisites

- MongoDB is needed for operations that read or write Mongoose models. The connection routine logs a failure and continues in development mode, so successful API operations still depend on database availability where they access a model.
- Gemini-backed recommendation, chat, resume analysis, and skill-gap endpoints need `GEMINI_API_KEY` configured and a reachable Gemini service.
- Learning-path and career-detail endpoints query MongoDB collections; the repository contains static data modules but no observed import/seed path linking them to those collections.

## Requirements that cannot be established

Supported Node.js version, MongoDB version, production process manager, hosting platform, CORS origin policy, deployment URLs, and browser support matrix: **Requires confirmation**.
