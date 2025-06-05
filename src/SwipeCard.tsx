import type { HTMLProps } from "react";
import CatCard from "./CatCard";
import type { CatSchema } from "./cat_fetcher";
import { Button } from "@/components/ui/button";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { Badge } from "./components/ui/badge";

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
  return (
    <div {...props}>
      <div className="w-full">
        <CatCard
          schema={schema}
          cardType="small"
          className="max-h-[calc(100vh/2)] mx-auto"
        />
      </div>
      <div className="mt-3 max-w-full">
        {schema.tags.map((tag) => (
          <Badge variant={"secondary"} className="mx-1">
            {tag}
          </Badge>
        ))}
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
