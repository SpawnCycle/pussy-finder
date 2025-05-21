import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CatProvider } from "./CatProvider.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { CatDresser } from "./CatDresser.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <CatProvider>
        <CatDresser>
          <App /> {/* 3 fucking providers, are we deadass */}
          <Toaster position="top-left" className="fixed top-0 left-0" />
        </CatDresser>
      </CatProvider>
    </ThemeProvider>
  </StrictMode>,
);
