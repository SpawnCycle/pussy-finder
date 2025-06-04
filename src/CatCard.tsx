import type { HTMLProps } from "react";
import { useDresser } from "./CatDresser";
import {
  getExactCatURL,
  type CatSchema,
  type PictureType,
} from "./cat_fetcher";
import { cn } from "./lib/utils";

type CatCardProps = {
  schema: CatSchema;
  cardType?: PictureType;
} & Omit<HTMLProps<HTMLImageElement>, "src">;

export default function CatCard({
  schema,
  cardType = "square",
  className,
  ...props
}: CatCardProps) {
  const dresser = useDresser();

  return (
    <img
      key={schema.id}
      className={cn("rounded", className)}
      onClick={() => {
        dresser.openDresser(schema.id);
      }}
      src={getExactCatURL({
        id: schema.id,
        type: cardType,
      })}
      {...props}
    />
  );
}
