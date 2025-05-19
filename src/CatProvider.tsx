import type { CatSchema } from "./cat_fetcher";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type State<T> = [T, React.Dispatch<T>];
export type AppState = "loading" | "error" | "loaded";

export type CatContext = {
  tags: State<string[]>;
  selectedTags: State<string[]>;
  content: State<CatSchema[]>;
  appState: State<AppState>;
  loadState: State<AppState>;
  appError: State<Error>;
};

const CatCtx = createContext<CatContext | undefined>(undefined);

export function CatProvider({ children }: { children: ReactNode }) {
  const tags = useState<string[]>([]);
  const selectedTags = useState<string[]>([]);
  const content = useState<CatSchema[]>([]);
  const appState = useState<AppState>("loading");
  const loadState = useState<AppState>("loading");
  const appError = useState<Error>(new Error());

  return (
    <CatCtx.Provider
      value={{ tags, selectedTags, content, appState, appError, loadState }}
    >
      {children}
    </CatCtx.Provider>
  );
}

export function useCats() {
  const ctx = useContext(CatCtx);
  if (!ctx) throw new Error("You fucked up");
  return ctx;
}
