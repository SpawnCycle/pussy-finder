import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CatProvider } from "./CatProvider.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { CatDresser } from "./CatDresser.tsx";
import ContentTypeProvider from "./ContentTypeProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <CatProvider>
        <QueryClientProvider client={queryClient}>
          <CatDresser>
            <ContentTypeProvider>
              <App />
              {/* 4 fucking providers, are we deadass (last checked: 2025-06-01 14:18)*/}
              <Toaster position="top-left" className="fixed" />
            </ContentTypeProvider>
          </CatDresser>
        </QueryClientProvider>
      </CatProvider>
    </ThemeProvider>
  </StrictMode>,
);
