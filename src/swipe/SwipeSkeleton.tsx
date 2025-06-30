import type { HTMLProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

type SwipeSkeletonProps = {} & HTMLProps<HTMLDivElement>;

export default function SwipeSkeleton({
  children,
  ...props
}: SwipeSkeletonProps) {
  return (
    <div {...props}>
      <Skeleton className="h-[clamp(100px,50vh,500px)] aspect-square" />
      <div className="mt-3 max-w-full flex flex-row">
        {[...Array(3).keys()].map(() => (
          <Skeleton className="w-[45px] h-[22px] mx-1" />
        ))}
      </div>
      {children}
    </div>
  );
}
