import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Self-hosted fonts — @fontsource zet font-display: swap automatisch */
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/app.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
