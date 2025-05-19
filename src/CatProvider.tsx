import type { CatSchema } from "./cat_fetcher";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type useOut<T> = [T, React.Dispatch<T>];
export type AppState = "loading" | "error" | "loaded";

type CatContextType = {
  tags: useOut<string[]>;
  selectedTags: useOut<string[]>;
  content: useOut<CatSchema[]>;
  appState: useOut<AppState>;
  appError: useOut<Error>;
};

const CatContext = createContext<CatContextType | undefined>(undefined);

export function CatProvider({ children }: { children: ReactNode }) {
  const tags = useState<string[]>([]);
  const selectedTags = useState<string[]>([]);
  const content = useState<CatSchema[]>([]);
  const appState = useState<AppState>("loading");
  const appError = useState<Error>(new Error());

  return (
    <CatContext.Provider
      value={{ tags, selectedTags, content, appState, appError }}
    >
      {children}
    </CatContext.Provider>
  );
}

export function useCats() {
  const ctx = useContext(CatContext);
  if (!ctx) throw new Error("You fucked up");
  return ctx;
}
