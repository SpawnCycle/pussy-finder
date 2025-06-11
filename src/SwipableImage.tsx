import {
  type AnimationDefinition,
  type HTMLMotionProps,
  motion,
  type PanInfo,
  useAnimation,
} from "framer-motion";
import {
  getExactCatURL,
  sleep,
  useSuspensableImage,
  type CatSchema,
  type PictureType,
} from "./cat_fetcher";
import { cn } from "./lib/utils";
import { useState } from "react";

type SwipableImageProps = {
  schema: CatSchema;
  cardType?: PictureType;
  onDragLeft?: () => any;
  onDragRight?: () => any;
} & Omit<HTMLMotionProps<"img">, "src" | "drag" | "onDragEnd">;

const distanceThreshold = 75;

export const exitVariants = {
  left: { x: "-100vw", rotate: "-30deg" },
  right: { x: "100vw", rotate: "30deg" },
};

export default function SwipableImage({
  animate,
  schema,
  cardType = "square",
  onDragRight,
  onDragLeft,
  className,
  ...props
}: SwipableImageProps) {
  const [shouldCenter, setShouldCenter] = useState<boolean>(false);
  const [exitSide, setExitSide] = useState<"left" | "right" | undefined>(
    undefined,
  );

  const url = getExactCatURL({
    id: schema.id,
    type: cardType,
  });
  useSuspensableImage(url);

  const handleDragEnd = (
    _ev: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const offset = info.offset;
    const distance = Math.sqrt(Math.pow(offset.x, 2) + Math.pow(offset.y, 2));
    const dotproduct = offset.x * 1 + offset.y * 0;
    if (distance > distanceThreshold && dotproduct > 0) {
      if (onDragRight) {
        setExitSide("right");
        onDragRight();
      }
    } else if (distance > distanceThreshold && dotproduct < 0) {
      if (onDragLeft) {
        setExitSide("left");
        onDragLeft();
      }
    } else {
      setShouldCenter(true);
      sleep(300).then(() => setShouldCenter(false));
    }
  };

  return (
    <motion.img
      drag
      animate={
        animate ??
        (exitSide
          ? exitVariants[exitSide]
          : shouldCenter
            ? { x: 0, y: 0 }
            : undefined)
      }
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      initial={{ x: 0, y: 0 }}
      onDragEnd={handleDragEnd}
      className={cn("rounded", className)}
      src={url}
      {...props}
    />
  );
}
