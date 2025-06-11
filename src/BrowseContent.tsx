import { Button } from "@/components/ui/button";
import { useCats, type LoadState } from "./CatProvider";
import { fetch_me_their_cats, type CatSchema } from "./cat_fetcher";
import { cat_limit } from "./Content";
import { toast } from "sonner";
import { Suspense, useEffect, useState, type HTMLProps } from "react";
import CatCard from "./CatCard";
import { Skeleton } from "./components/ui/skeleton";

export default function CatContent(
  props: Omit<HTMLProps<HTMLDivElement>, "children">,
) {
  const ctx = useCats();
  const [selectedTags, _setSelectedTags] = ctx.selectedTags;
  const [_state, setState] = ctx.appState;
  const [_error, setError] = ctx.fatalAppError;
  const [content, setContent] = useState<CatSchema[]>([]);
  const [localState, setLocalState] =
    useState<Exclude<LoadState, "error">>("loading"); // exclude error, because if we error, it's the whole app's problem

  useEffect(() => {
    const async_fn = async () => {
      setLocalState("loading");
      const res = await fetch_me_their_cats({
        tags: selectedTags,
        limit: cat_limit,
      });
      if (res instanceof Error) {
        setState("error");
        setError(res.message);
        return;
      }
      setLocalState("loaded");
      setContent(res);
    };
    async_fn();
  }, [selectedTags]);

  const more_cats_fn = async () => {
    // no localState, because we don't want to take away the whole app while loading extra things
    const res = await fetch_me_their_cats({
      skip: content.length,
      tags: selectedTags,
      limit: cat_limit,
    });
    if (res instanceof Error) {
      setState("error");
      setError(res.message);
      return;
    }
    if (!(res.length > 0)) {
      throw "That's it! No more cats :(";
    }

    setContent([...content, ...res]);
  };

  return (
    <div {...props}>
      {localState === "loading" ? (
        <div className="w-screen h-screen">
          <div className="absolute translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2">
            Fetching you the best cats...
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap justify-between gap-y-2">
            {content.map((val) => (
              <Suspense
                fallback={
                  <Skeleton className="max-sm:w-[150px] w-[200px] aspect-square" />
                }
              >
                <CatCard
                  schema={val}
                  className="max-sm:w-[150px] max-sm:h-[150px] w-[200px] h-[200px]"
                />
              </Suspense>
            ))}
          </div>
          <div className="w-full">
            <Button
              variant={"ghost"}
              className="block mx-auto mt-3 mb-5"
              onClick={() =>
                toast.promise(more_cats_fn(), {
                  loading: "Getting cats...",
                  success: "Cats are ready!",
                  error: (v) => v,
                  cancel: {
                    label: "hide",
                    onClick: () => { },
                  },
                })
              }
            >
              Give me more
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
