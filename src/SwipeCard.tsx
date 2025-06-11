import { Suspense, type HTMLProps } from "react";
import CatCard from "./CatCard";
import type { CatSchema } from "./cat_fetcher";
import { Button } from "@/components/ui/button";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { useCats } from "./CatProvider";
import ExtraTag from "./ExtraTag";
import SwipeSkeleton from "./SwipeSkeleton";

export type SwipeCardProps = {
  schema: CatSchema;
  onLike?: () => void;
  onDislike?: () => void;
} & HTMLProps<HTMLDivElement>;

export default function SwipeCard({
  schema,
  onLike,
  onDislike,
  ...props
}: SwipeCardProps) {
  const ctx = useCats();
  const [_selectedTags, setSelectedTags] = ctx.selectedTags;

  return (
    <div {...props}>
      <div className="h-[500px] grid place-items-center">
        <div className="w-fit my-auto">
          <Suspense fallback={<SwipeSkeleton />}>
            <CatCard
              schema={schema}
              cardType="medium"
              className="max-h-[400px] mx-auto"
            />
            <div className="mt-3 max-w-[300px]">
              {schema.tags.map((tag) => (
                <ExtraTag
                  tag={tag}
                  onClick={() =>
                    setSelectedTags((tags) =>
                      tags.some((t) => t == tag) ? tags : [...tags, tag],
                    )
                  }
                />
              ))}
            </div>
          </Suspense>
        </div>
      </div>
      <div className="w-full flex pt-2">
        <Button className="mr-auto" variant={"ghost"} onClick={onDislike}>
          <FaHeartBroken className="size-5" />
        </Button>
        <Button className="ml-auto" variant={"ghost"} onClick={onLike}>
          <FaHeart className="size-5" />
        </Button>
      </div>
    </div>
  );
}
