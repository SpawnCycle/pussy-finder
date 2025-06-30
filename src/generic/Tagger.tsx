import { useRef, useState } from "react";
import { useCats } from "@/providers/CatProvider";
import { useDebounce } from "use-debounce";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import BadgeTags from "./BadgeTags";

export default function Tagger() {
  const ctx = useCats();
  const [tags, _setTags] = ctx.tags;
  const [selectedTags, setSelectedTags] = ctx.selectedTags;
  const [search, setSearch] = useDebounce<string>("", 250);
  const [activeTag, setActiveTag] = useState(0);
  const activeRef = useRef<HTMLDivElement>(null);

  const filtered = tags.filter(
    (v) => v.includes(search) && !selectedTags.includes(v),
  );

  return (
    <div className="pb-2 m-2 relative">
      <Dialog>
        <DialogTrigger className="hover:bg-card hover:cursor-pointer border rounded py-0.5 px-1.5 bg-secondary text-card-foreground">
          Add tags
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a tag</DialogTitle>
            <DialogDescription>Filter posts by tags</DialogDescription>
          </DialogHeader>
          Current filters:
          <BadgeTags />
          <input
            onChange={(ev) => setSearch(ev.target.value)}
            onKeyUp={(ev) => {
              switch (ev.key) {
                case "ArrowDown":
                  {
                    if (filtered.length > activeTag)
                      setActiveTag(activeTag + 1);
                    if (activeRef.current)
                      activeRef.current.scrollIntoView({ block: "center" });
                  }
                  break;
                case "ArrowUp":
                  {
                    if (filtered.length != 0) setActiveTag(activeTag - 1);
                    if (activeRef.current)
                      activeRef.current.scrollIntoView({ block: "center" });
                  }
                  break;
                case "Enter":
                  {
                    const tag = filtered[activeTag];
                    if (tag.length == 0) return;
                    setSelectedTags([...selectedTags, tag]);
                  }
                  break;
                default:
                  break;
              }
            }}
            defaultValue={search}
            className="border rounded my-3"
          />
          {filtered.length > 0 && (
            <div className="max-h-[150px] overflow-scroll bg-card z-50 border rounded top-1/2 left-0">
              {filtered.map((tag, i) => (
                <div
                  className={`transition-colors duration-200 ${activeTag == i ? "bg-muted-foreground text-muted" : ""}`}
                  onClick={() => {
                    setSelectedTags([...selectedTags, tag]);
                    setActiveTag(0);
                  }}
                  onMouseMove={() => {
                    setActiveTag(i);
                  }}
                  ref={activeTag == i ? activeRef : undefined}
                  key={tag}
                >
                  <button className="px-2 py-0.5 transition-colors duration-200">
                    {tag}
                  </button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div>
        <div className="text-card-foreground">Currently selected:</div>
        <BadgeTags />
      </div>
    </div>
  );
}
