import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CatProvider } from "./CatProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CatProvider>
      <App />
    </CatProvider>
  </StrictMode>,
);
