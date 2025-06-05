import { Suspense, useEffect, useState, type HTMLProps } from "react";
import { useCats, type LoadState } from "./CatProvider";
import { getRandomCatURL, type CatSchema } from "./cat_fetcher";
import SwipeCard from "./SwipeCard";
import { Button } from "./components/ui/button";
import SwipeSkeleton from "./SwipeSkeleton";

export default function SwipeContent(
  props: Omit<HTMLProps<HTMLDivElement>, "children">,
) {
  const ctx = useCats();
  const [selectedTags, _setSelectedTags] = ctx.selectedTags;
  const [_appState, setAppState] = ctx.appState;
  const [_appError, setAppError] = ctx.fatalAppError;
  const [memory, setMemory] = useState<CatSchema[]>([]); // Temp
  const [currentSwipe, setCurrentSwipe] = useState<CatSchema | undefined>();
  const [lastSwipe, setLastSwipe] = useState<CatSchema | undefined>();
  const [localState, setLocalState] =
    useState<Exclude<LoadState, "error">>("loading");

  const nextCat = () => setLastSwipe(currentSwipe);

  const getNewCat = async (): Promise<CatSchema | Error> => {
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
    } while (memory.some((val) => val.id == cat.id));
    console.log(cat);
    return cat;
  };

  useEffect(() => {
    const async_fn = async () => {
      setLocalState("loading");
      const res = await getNewCat();
      if (res instanceof Error) {
        setAppError(res.message);
        setAppState("error");
        return;
      }
      if (currentSwipe) setMemory([...memory, currentSwipe]);
      setCurrentSwipe(res);
      setLocalState("loaded");
    };
    async_fn();
  }, [lastSwipe]);

  // react-draggable just doesn't work for some reason and the other libraries kinda suck, so I'll have to homebrew this shit
  // TODO: make it actually swipeable or something
  // TODO: Fucking react-query or something, I can't be fucked managing all this loading manually
  return (
    <div {...props}>
      <div className="w-full min-h-[calc(100vh/2)]">
        {currentSwipe && localState != "loading" && (
          <SwipeCard
            schema={currentSwipe}
            className="m-auto w-fit max-w-9/10 border rounded p-2 max-h-[80vh]"
          />
        )}
        {localState == "loading" && (
          <SwipeSkeleton className="m-auto w-fit border rounded p-2" />
        )}
        {/* <SwipeSkeleton className="m-auto w-fit border rounded p-2" /> */}
        <Button onClick={nextCat}>Next</Button>
      </div>
    </div>
  );
}
