import type { HTMLProps } from "react";
import { useCats } from "@/providers/CatProvider";
import { Badge } from "@/components/ui/badge";

type badgeTagsProps = {
  asStatic?: boolean;
} & Omit<HTMLProps<HTMLDivElement>, "children">;

export default function BadgeTags({ asStatic, ...props }: badgeTagsProps) {
  const ctx = useCats();
  const [selectedTags, setSelectedTags] = ctx.selectedTags;

  return (
    <div {...props}>
      {selectedTags.length > 0 ? (
        selectedTags.map((v) => (
          <Badge
            variant={"secondary"}
            className="mx-1 transition-all hover:bg-secondary-foreground hover:text-secondary hover:cursor-pointer"
            onClick={() =>
              setSelectedTags(selectedTags.filter((val) => val != v))
            }
          >
            {v}
          </Badge>
        ))
      ) : (
        <div className="text-muted-foreground">None</div>
      )}
    </div>
  );
}
