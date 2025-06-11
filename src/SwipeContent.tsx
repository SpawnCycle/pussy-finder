import { Suspense, useEffect, useRef, useState, type HTMLProps } from "react";
import { useCats, type LoadState } from "./CatProvider";
import {
  fetch_me_their_cats,
  shuffle,
  sleep,
  type CatSchema,
} from "./cat_fetcher";
import { Button } from "./components/ui/button";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { Skeleton } from "./components/ui/skeleton";
import SwipableImage, { exitVariants } from "./SwipableImage";
import { Label } from "./components/ui/label";
import { cn } from "./lib/utils";

// subject to change
const pool_size = 50;
const queue_size = 7;

type PoolDataT = {
  catsConsumed: number;
  isContinuable: boolean;
  data: CatSchema[];
};

export default function SwipeContent(
  props: Omit<HTMLProps<HTMLDivElement>, "children">,
) {
  const ctx = useCats();
  const [selectedTags, _setSelectedTags] = ctx.selectedTags;
  const [_appError, setAppError] = ctx.fatalAppError;
  const [likedCats, setLikedCats] = ctx.likedCats;
  const memory = useRef<Array<CatSchema>>([]); // So the same pictures don't show up
  const [queue, setQueue] = useState<CatSchema[]>([]);
  const [_localState, setLocalState] = useState<
    Exclude<LoadState, "error"> | "ran out"
  >("loading");
  const [swiping, setSwiping] = useState<"left" | "right" | undefined>(
    undefined,
  );
  const pool = useRef<PoolDataT>({
    isContinuable: false,
    data: [],
    catsConsumed: 0,
  }); // I mean does it really need to be a state?

  const onSwipe = (side: "left" | "right") => {
    const firstQ = queue.at(queue.length - 1);
    if (queue.length == 0 || !firstQ) {
      // nothing to swipe, what are we doing
      ensureQueueIfPossible(false);
      return;
    }

    memory.current.push(firstQ);
    if (side == "right") setLikedCats((likes) => [...likes, firstQ]); // like

    setQueue(queue.filter((v) => v != firstQ));
    ensureQueueIfPossible(false);
  };

  const ensureQueueIfPossible = (reset: boolean) => {
    const pool_copy = pool.current.data
      .slice()
      .filter(
        (p) =>
          !memory.current.includes(p) &&
          !queue.includes(p) &&
          !likedCats.includes(p),
      );
    shuffle(pool_copy);
    const new_queue = pool_copy.slice(
      0,
      Math.min(pool_copy.length, queue_size - (!reset ? queue.length : 0)),
    );
    if (reset) setQueue(new_queue);
    else
      setQueue((oldQueue) => {
        return [...new_queue, ...oldQueue].filter(
          (q) => !memory.current.includes(q) && !likedCats.includes(q),
        );
      });
    new_queue.forEach((q) => {
      pool.current.data = pool.current.data.filter((v) => v != q);
    });
    if (pool.current.data.length < queue_size) getNextPoolChunk();
  };

  // initial pool
  useEffect(() => {
    const async_fn = async () => {
      setLocalState("loading");
      const res = await fetch_me_their_cats({
        limit: pool_size,
        tags: selectedTags,
      });
      if (res instanceof Error) {
        setAppError(res.message); // we are giga fucked
        return;
      }
      pool.current = {
        isContinuable: res.length == pool_size,
        data: res.filter(
          (d) =>
            !memory.current.includes(d) &&
            !queue.includes(d) &&
            !likedCats.includes(d),
        ),
        catsConsumed: res.length,
      };
      setLocalState("loaded");
      ensureQueueIfPossible(true);
    };
    async_fn();
  }, [selectedTags]);

  // returns if the next pool chunk even exists
  const getNextPoolChunk = (): boolean => {
    if (!pool.current.isContinuable) return false;
    const async_fn = async () => {
      const res = await fetch_me_their_cats({
        skip: pool.current.catsConsumed,
        limit: pool_size,
        tags: selectedTags,
      }); // shadow loading so to say
      if (res instanceof Error) {
        setAppError(res.message); // still giga fucked
        return;
      }
      pool.current = {
        data: [
          ...pool.current.data,
          ...res.filter(
            (c) =>
              !memory.current.includes(c) &&
              !queue.includes(c) &&
              !likedCats.includes(c),
          ),
        ],
        isContinuable: res.length == pool_size,
        catsConsumed: pool.current.catsConsumed + res.length,
      };
    };
    async_fn();
    return true;
  };

  return (
    <div {...props}>
      <div className="h-fit min-h-[75vh]">
        <div className="relative min-h-[400px] h-fit">
          {(queue.length == 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-1/2 animate-in fade-in">
              Couldn't find more cats with those tags :(
            </div>
          )) ||
            queue.map((cat, ind) => (
              <>
                <Suspense
                  fallback={
                    <Skeleton
                      className={cn(
                        "absolute w-[300px] aspect-square top-1/2 left-1/2 -translate-1/2",
                        ind >= queue.length - 1
                          ? "animate-in fade-in"
                          : "hidden",
                      )}
                    />
                  }
                >
                  <SwipableImage
                    key={cat.id}
                    schema={cat}
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-1/2 max-h-[400px] bg-foreground/50",
                      ind >= queue.length - 1 ? "animate-in fade-in" : "hidden",
                    )}
                    cardType="small"
                    animate={
                      queue.length - 1 == ind && swiping
                        ? exitVariants[swiping]
                        : undefined
                    }
                    onDragLeft={() => {
                      sleep(400).then(() => [onSwipe("left")]);
                    }}
                    onDragRight={() => {
                      sleep(400).then(() => [onSwipe("right")]);
                    }}
                  />
                </Suspense>
              </>
            ))}
        </div>
        <div className="w-[clamp(200px,500px,100%)] flex mt-5 mx-auto">
          <Button
            className="mr-auto flex flex-col h-fit"
            variant={"ghost"}
            onClick={() => {
              setSwiping("left");
              sleep(400).then(() => [setSwiping(undefined), onSwipe("left")]);
            }}
          >
            <FaHeartBroken id="dislike" className="size-5" />
            <Label htmlFor="dislike">Dislike</Label>
          </Button>
          <Button
            className="ml-auto flex flex-col h-fit"
            variant={"ghost"}
            onClick={() => {
              setSwiping("right");
              sleep(400).then(() => [setSwiping(undefined), onSwipe("right")]);
            }}
          >
            <FaHeart id="like" className="size-5" />
            <Label htmlFor="like">Like</Label>
          </Button>
        </div>
      </div>
    </div>
  );
}
