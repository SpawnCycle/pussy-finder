import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";

export type State<T> = [T, React.Dispatch<SetStateAction<T>>];
export type LoadState = "loading" | "error" | "loaded";

export type CatContext = {
  tags: State<string[]>;
  selectedTags: State<string[]>;
  appState: State<LoadState>;
  fatalAppError: State<string>;
  warnings: State<Error[]>;
  catFact: State<string | undefined>;
};

const CatCtx = createContext<CatContext | undefined>(undefined);

export function CatProvider({ children }: { children: ReactNode }) {
  const tags = useState<string[]>([]);
  const selectedTags = useState<string[]>([]);
  const appState = useState<LoadState>("loading");
  const fatalAppError = useState<string>("");
  const catFact = useState<string | undefined>(undefined);
  const warnings = useState<Error[]>([]);

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
        appState,
        fatalAppError,
        catFact,
        warnings,
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
