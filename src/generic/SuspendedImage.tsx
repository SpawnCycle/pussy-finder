import { useSuspensableImage } from "@/cat_fetcher";
import { type ComponentProps } from "react";

type PrefetchedImageProps = {} & ComponentProps<"img">;

export default function SuspendedImage({
  src,
  ...props
}: PrefetchedImageProps) {
  if (src) useSuspensableImage(src);

  return <img src={src} {...props} />;
}
