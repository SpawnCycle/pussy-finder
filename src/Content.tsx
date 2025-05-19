import type { HTMLProps } from "react";
import { getExactCatURL } from "./cat_fetcher";
import { useCats } from "./CatProvider";
import Tagger from "./Tagger";

export interface ContentProps extends HTMLProps<"div"> { }

export default function Content({ ...props }: ContentProps) {
  const ctx = useCats();
  const [tags, setTags] = ctx.tags;
  const [content, setContent] = ctx.content;

  return (
    <div>
      <Tagger />
      <div>
        {content.map((val) => (
          <img src={getExactCatURL({ id: val.id, type: "square" })} />
        ))}
      </div>
    </div>
  );
}
