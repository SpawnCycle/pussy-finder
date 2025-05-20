import type { CatSchema } from "./cat_fetcher";
import React, {
  createContext,
  useContext,
  useEffect,
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
  catFact: State<string | undefined>;
};

const CatCtx = createContext<CatContext | undefined>(undefined);

export function CatProvider({ children }: { children: ReactNode }) {
  const tags = useState<string[]>([]);
  const selectedTags = useState<string[]>([]);
  const content = useState<CatSchema[]>([]);
  const appState = useState<AppState>("loading");
  const loadState = useState<AppState>("loading");
  const appError = useState<Error>(new Error());
  const catFact = useState<string | undefined>(undefined);

  useEffect(() => {
    const original_name = document.title;
    const blur_fn = () => {
      document.title = "There are lonely pussies in your area...";
    };
    const focus_fn = () => {
      document.title = original_name;
    };

    document.addEventListener("blur", blur_fn);
    document.addEventListener("focus", focus_fn);

    return () => {
      document.removeEventListener("blur", blur_fn);
      document.removeEventListener("focus", focus_fn);
    };
  }, []);

  return (
    <CatCtx.Provider
      value={{
        tags,
        selectedTags,
        content,
        appState,
        appError,
        loadState,
        catFact,
      }}
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
