import { fetch_me_their_cats, getExactCatURL } from "./cat_fetcher";
import { useCats } from "./CatProvider";
import Tagger from "./Tagger";
import Topbar from "./Topbar";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { useDresser } from "./CatDresser";

export const cat_limit = 25;

export default function Content() {
  const ctx = useCats();
  const dresser = useDresser();
  const [content, setContent] = ctx.content;

  const more_cats_fn = async () => {
    const res = await fetch_me_their_cats(
      { skip: content.length, limit: cat_limit },
      ctx,
    );
    if (!res) throw new Error("There was an error getting the pussies :(");

    if (!(res.length > 0)) {
      return toast("That's it! No more cats :(", {
        cancel: { label: "hide", onClick: () => {} },
      });
    }

    setContent([...content, ...res]);
  };

  return (
    <div>
      <Topbar />
      <Tagger />
      <div className="flex flex-wrap justify-evenly gap-y-2">
        {content.map((val) => (
          <img
            key={val.id}
            className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] border rounded"
            onClick={() => {
              dresser.openDresser(val.id);
            }}
            src={getExactCatURL({
              id: val.id,
              type: "square",
            })}
          />
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
              error: "Couldn't get the cats :(",
            })
          }
        >
          Give me more
        </Button>
      </div>
    </div>
  );
}
