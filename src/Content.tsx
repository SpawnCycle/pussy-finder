import { fetch_me_their_cats, getExactCatURL } from "./cat_fetcher";
import { useCats } from "./CatProvider";
import Tagger from "./Tagger";
import Topbar from "./Topbar";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { useDresser } from "./CatDresser";

export default function Content() {
  const ctx = useCats();
  const dresser = useDresser();
  const [content, setContent] = ctx.content;

  return (
    <div>
      <Topbar />
      <Tagger />
      <div className="flex flex-wrap">
        {content.map((val) => (
          <img
            className="sm:w-[200px] w-[150px]"
            onClick={() => {
              dresser.openDresser(val.id);
            }}
            src={getExactCatURL({ id: val.id, type: "square" })}
          />
        ))}
      </div>
      <div className="w-full">
        <Button
          variant={"ghost"}
          className="block mx-auto my-3"
          onClick={async () => {
            const res = await fetch_me_their_cats(
              { skip: content.length },
              ctx,
            );
            if (!res) return;

            if (!(res.length > 0)) {
              toast.getToasts();
              return toast("That's it! No more cats :(", {
                cancel: { label: "hide", onClick: () => {} },
              });
            }

            setContent([...content, ...res]);
          }}
        >
          Give me more
        </Button>
      </div>
    </div>
  );
}
