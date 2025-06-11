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
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <div className="w-full h-full p-4">
          <div>Whoops, looks like something went really wrong</div>
          <div>Currently known issues:</div>
          <ul>
            <li>
              The cataas api times out on an image request and the whole app
              juts shits itself because the fucking new Image() js bullshit
              doesn't do shit with the onerror function I gave it
            </li>
          </ul>
        </div>
      }
    >
      <ThemeProvider defaultTheme="dark">
        <CatProvider>
          <QueryClientProvider client={queryClient}>
            <CatDresser>
              <ContentTypeProvider>
                <App />
                {/* 5 fucking providers, are we deadass (last checked: 2025-06-11 15:51)*/}
                <Toaster position="top-left" className="fixed" />
              </ContentTypeProvider>
            </CatDresser>
          </QueryClientProvider>
        </CatProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
