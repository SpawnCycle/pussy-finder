import { useState } from "react";
import { useCats } from "./CatProvider";

export default function Tagger() {
  const ctx = useCats();
  const [tags, setTags] = ctx.tags;
  const [selectedTags, setSelectedTags] = ctx.selectedTags;
  const [search, setSearch] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div>
      <input
        onChange={(ev) => setSearch(ev.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <div
        className={
          "absolute max-h-[500px] min-w-[200px] overflow-y-scroll bg-red-950 z-50 border rounded" +
          (focused ? "" : " hidden")
        }
      >
        {tags
          .filter((v) => v.includes(search))
          .map((v) => (
            <div>{v}</div>
          ))}
      </div>
    </div>
  );
}
