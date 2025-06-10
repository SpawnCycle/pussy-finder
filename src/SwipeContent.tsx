import { useEffect, useState, type HTMLProps } from "react";
import { useCats, type LoadState } from "./CatProvider";
import { getRandomCatURL, type CatSchema } from "./cat_fetcher";
import SwipeCard from "./SwipeCard";
import { Button } from "./components/ui/button";
import SwipeSkeleton from "./SwipeSkeleton";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

const loop_limit = 5;

export default function SwipeContent(
  props: Omit<HTMLProps<HTMLDivElement>, "children">,
) {
  const ctx = useCats();
  const [selectedTags, _setSelectedTags] = ctx.selectedTags;
  const [_appState, setAppState] = ctx.appState;
  const [_appError, setAppError] = ctx.fatalAppError;
  const [_likedCats, setLikedCats] = ctx.likedCats;
  const [memory, setMemory] = useState<CatSchema[]>([]); // Temp
  const [currentSwipe, setCurrentSwipe] = useState<CatSchema | undefined>();
  const [lastSwipe, setLastSwipe] = useState<CatSchema | undefined>();
  const [localState, setLocalState] = useState<
    Exclude<LoadState, "error"> | "ran out"
  >("loading");

  const nextCat = () => {
    if (localState == "ran out") return setLastSwipe(undefined);
    return setLastSwipe(currentSwipe);
  };

  const getNextCatFn = async () => {
    setLocalState("loading");
    const res = await getNewCat();
    if (res === undefined) {
      setLocalState("ran out");
      return;
    }
    if (res instanceof Error) {
      setAppError(res.message);
      setAppState("error");
      return;
    }
    setMemory((mem) => [...mem, res]);
    setCurrentSwipe(res);
    setLocalState("loaded");
  };

  // TODO: make this shit work
  // another TODO: rethink the approach, this is still not ideal (fetch first 100 and just randomly select from that?)
  const getNewCat = async (): Promise<CatSchema | Error | undefined> => {
    let i = 0;
    let cat: CatSchema;
    do {
      const url = getRandomCatURL({ tags: selectedTags, mode: "json" });
      try {
        const res = await fetch(url);
        if (!res.ok) setAppError("Could not load new cats :(");
        cat = await res.json();
      } catch (err) {
        return new Error(
          "There was an internet error while trying to fetch the cats :(",
        );
      }
      i++;
    } while (memory.some((val) => val.id == cat.id) && i < loop_limit);
    return memory.some((val) => val.id == cat.id)
      ? undefined
      : Object.prototype.hasOwnProperty.call(cat, "id") // ugly ass
        ? cat
        : undefined;
  };

  useEffect(() => {
    getNextCatFn();
  }, [lastSwipe]);

  // react-draggable just doesn't work for some reason and the other libraries kinda suck, so I'll have to homebrew this shit
  // TODO: make it actually swipeable or something
  // TODO: Fucking react-query or something, I can't be fucked managing all this loading manually
  return (
    <div {...props}>
      <div className="w-full min-h-[calc(100vh/2)]">
        {currentSwipe && localState == "loaded" && (
          <SwipeCard
            schema={currentSwipe}
            onLike={() => {
              if (currentSwipe) setLikedCats((cats) => [...cats, currentSwipe]);
              nextCat();
            }}
            onDislike={nextCat}
            className="m-auto w-fit max-w-9/10 p-2 max-h-[80vh]"
          />
        )}
        {localState == "ran out" && (
          <div className="w-full h-[60vh] relative">
            <div className="w-fit absolute top-1/2 left-1/2 -translate-1/2">
              <div>ran out of cats :(</div>
              <Button
                className="my-1.5"
                variant={"secondary"}
                onClick={getNextCatFn}
              >
                Redo
              </Button>
            </div>
          </div>
        )}
        {localState == "loading" && (
          <div>
            <SwipeSkeleton className="m-auto w-fit rounded mt-12 p-2 h-[500px]">
              <div className="flex pt-2 mt-9">
                {" "}
                {/* one hack of a solution */}
                <Button className="mr-auto" variant={"ghost"}>
                  <FaHeartBroken className="size-5" />
                </Button>
                <Button className="ml-auto" variant={"ghost"}>
                  <FaHeart className="size-5" />
                </Button>
              </div>
            </SwipeSkeleton>
          </div>
        )}
      </div>
    </div>
  );
}
