import { type HTMLMotionProps, motion, type PanInfo } from "framer-motion";
import {
  getExactCatURL,
  sleep,
  useSuspensableImage,
  type CatSchema,
  type PictureType,
} from "@/cat_fetcher";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDresser } from "@/providers/CatDresser";

type SwipableImageProps = {
  schema: CatSchema;
  cardType?: PictureType;
  onDragLeft?: () => any;
  onDragRight?: () => any;
} & Omit<HTMLMotionProps<"img">, "src" | "drag" | "onDragEnd">;

const distanceThreshold = 50;
const x_severity = 1;
const y_severity = 0.5;

export const exitVariants = {
  left: { x: "-125vw", rotate: "-30deg" },
  right: { x: "125vw", rotate: "30deg" },
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
  const { openDresser } = useDresser();
  const isDragging = useRef<boolean>(false);

  const url = getExactCatURL({
    id: schema.id,
    type: cardType,
  });
  useSuspensableImage(url);

  const handleDragEnd = (
    _ev: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    isDragging.current = false;
    const offset = info.offset;
    const distance =
      Math.sqrt(
        Math.pow(offset.x * x_severity, 2) + Math.pow(offset.y * y_severity, 2),
      ) *
      (x_severity + y_severity);
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
      dragConstraints={{ bottom: 75, top: -100, left: -400, right: 400 }}
      onClick={() => {
        if (!isDragging.current) openDresser(schema);
      }}
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
      onDrag={() => (isDragging.current = true)}
      className={cn("rounded", className)}
      src={url}
      {...props}
    />
  );
}
