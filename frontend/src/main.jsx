/**
 * main.jsx
 * =========
 * Entry point for the React application.
 * Renders the App component into the DOM.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Render the app into the root div in index.html
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
