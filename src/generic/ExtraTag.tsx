import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExtraTagsProps = { tag: string } & Omit<
  ComponentProps<"span">,
  "children"
>;

const ExtraTagsVariansBase = "mx-1";
const ExtraTagsVariansExtended =
  ExtraTagsVariansBase +
  " " +
  "hover:bg-secondary-foreground hover:text-secondary hover:cursor-pointer";
function ExtraTagsVarians(onClick: boolean) {
  return onClick ? ExtraTagsVariansExtended : ExtraTagsVariansBase;
}

export default function ExtraTag({
  tag,
  className,
  onClick,
  ...props
}: ExtraTagsProps) {
  return (
    <Badge
      variant={"secondary"}
      className={cn(ExtraTagsVarians(onClick != undefined), className)}
      onClick={onClick}
      {...props}
    >
      {tag}
    </Badge>
  );
}
