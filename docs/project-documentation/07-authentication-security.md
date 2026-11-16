# Authentication and Security

## Implemented authentication flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as React frontend
  participant A as Auth API
  participant D as User collection
  U->>F: submit registration details
  F->>A: POST /api/auth/register
  A->>D: check email; store bcrypt hash
  U->>F: submit email and password
  F->>A: POST /api/auth/login
  A->>D: find user; compare bcrypt hash
  A-->>F: JWT, expires in 1 day
  F->>F: localStorage.setItem('token')
  F->>A: protected call with Bearer token
  A->>A: jwt.verify using JWT_SECRET
```

## Registration and login

`registerUser` requires `name`, `email`, and `password`; it checks `User.findOne({ email })`, hashes the password with `bcrypt.hash(password, 10)`, and creates the user. Login finds the email, compares the supplied password using `bcrypt.compare`, then signs `{ id: user._id }` with `JWT_SECRET` and `{ expiresIn: "1d" }`.

## JWT validation and protected routes

`protect` reads a header beginning `Bearer`, verifies its token, and assigns the decoded payload to `req.user`. API routes using this middleware are profile, dashboard, AI recommendation, both chat routes, resume analysis/history, and skill gap. Career and learning-path routes currently have no backend `protect` middleware.

On the frontend, `ProtectedRoute` only checks whether a token exists in `localStorage`; it does not verify token validity. Several API pages remove the token and redirect to `/login` after a backend 401 response.

## Logout and client storage

The navigation logout handler removes only `localStorage` key `token` and navigates to `/login`; there is no server-side logout or token revocation endpoint. The dashboard also stores `aiChatCount` locally; the actual conversation messages are React component state and are not persisted by the observed frontend.

## Security boundaries and unverified controls

Implemented evidence includes password hashing, unique email schema constraint, JWT verification, protected backend routes, PDF MIME/size checks, and generated temporary upload filenames. The following are not demonstrated in the repository and must not be claimed: HTTPS/TLS, CORS origin restriction (server uses `cors()` defaults), rate limiting, CSRF protection, input sanitization beyond shown checks, authorization roles, password-reset/email verification, token refresh/revocation, encryption at rest, audit logging, malware scanning, or secure-cookie token storage.
