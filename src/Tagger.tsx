import { useState } from "react";
import { useCats } from "./CatProvider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import BadgeTags from "./BadgeTags";

export default function Tagger() {
  const ctx = useCats();
  const [tags, setTags] = ctx.tags;
  const [selectedTags, setSelectedTags] = ctx.selectedTags;
  const [search, setSearch] = useState<string>("");

  const filtered = tags.filter(
    (v) => v.includes(search) && !selectedTags.includes(v),
  );

  return (
    <div className="pb-2 m-2 relative">
      <Dialog>
        <DialogTrigger className="hover:bg-card hover:cursor-pointer border rounded p-0.5 bg-secondary text-card-foreground">
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
              if (!(ev.key == "Enter")) return;
              const tag = filtered[0];
              if (tag.length == 0) return;
              setSelectedTags([...selectedTags, tag]);
            }}
            value={search}
            className="border rounded my-3"
          />
          <div className="max-h-[150px] overflow-scroll bg-card z-50 border rounded top-1/2 left-0">
            {filtered.map((tag) => (
              <div
                className="hover:bg-muted-foreground hover:text-muted"
                onClick={() => {
                  setSelectedTags([...selectedTags, tag]);
                }}
              >
                <button className="px-2 py-0.5">{tag}</button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <div className="text-card-foreground">Currently selected:</div>
        <BadgeTags />
      </div>
    </div>
  );
}
