# AI Career Advisor

## Purpose and interaction

The protected AI Career Advisor page (`AIChat.jsx`) lets a user select a suggested question or enter a message. It shows messages only within the current React page state, renders lightweight inline Markdown-like formatting, autoscrolls to the newest message, shows a thinking state, and retries the most recent question after a non-profile error.

## API path and processing

The page posts `{ message }` to `POST /api/ai-chat` with a Bearer token. `aiChatController.chatWithAI` rejects a non-string or blank message with 400, loads the current `Profile`, then calls `generateChatResponse(profile, trimmedMessage)`. The response shape is `{ response }`.

The Gemini prompt includes profile name, education, interest, skills, career goal, and the user question. It asks for concise (150–300 words), professional, practical, profile-relevant career advice. This chat request has no structured response schema; returned text is trimmed then sent to the client.

## Error and local state behavior

Missing profile returns 404, unavailable Gemini service returns 503, and other controller failures return a generic 500 message. The UI removes a stored token and redirects for 401, directs the user to Profile for 404, and offers a retry for other errors.

On each successful reply, the frontend increments `aiChatCount` in `localStorage`, which the dashboard displays as an AI-conversation count. No chat model, database storage, conversation-history API, or server-side conversation context beyond the submitted message and saved profile was found.

## Alternate endpoint

`POST /api/chat` is also protected and calls the same Gemini chat service, but returns `{ reply }` and has slightly different validation/error messages. No frontend caller for this endpoint was found in the inspected source, so its intended use: **Requires confirmation**.
