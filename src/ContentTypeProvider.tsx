import { createContext, useContext, useState, type ReactNode } from "react";
import type { State } from "./CatProvider";

export const contentTypes = [
  {
    type: "browse",
    description: `Browse all types of cats, make them say something, filter them by tags`,
  },
  {
    type: "swipe",
    description: `Swipe right on the cats you like to save them for later`,
  },
  {
    type: "liked",
    description: "Here you can view the cats you liked in the Swipe mode",
  },
] as const;
export type ContentT = (typeof contentTypes)[number]["type"]; // types galore, actually useful to do it like this btw, crazy

const ContentTypeCtx = createContext<State<ContentT> | undefined>(undefined);

export default function ContentTypeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const contentState = useState<ContentT>("browse");
  return (
    <ContentTypeCtx.Provider value={contentState}>
      {children}
    </ContentTypeCtx.Provider>
  );
}

export function useContentType() {
  const contentState = useContext(ContentTypeCtx);
  if (!contentState) throw "Can't use Content Type context without a provider";
  return contentState;
}
