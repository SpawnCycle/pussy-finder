import type { HTMLProps } from "react";
import CatCard from "./CatCard";
import type { CatSchema } from "./cat_fetcher";
import { Button } from "./components/ui/button";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

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
      <CatCard
        schema={schema}
        cardType="small"
        className="max-h-[calc(2*100vh/3)]"
      />
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
