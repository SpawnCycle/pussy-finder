import { useEffect, useState } from "react";
import {
  getAllTags,
  getCatsURL,
  getExactCatURL,
  type CatSchema,
} from "./cat_fetcher";

type AppState = "loading" | "error" | "loaded";

function App() {
  // const [prompt, setPrompt] = useState(null);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<Error>(new Error());
  const [state, setState] = useState<AppState>("loading");
  const [content, setContent] = useState<CatSchema[]>([]);
  const [loadState, setLoadState] = useState<AppState>("loading");
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>();

  useEffect(() => {
    const fetch_stuff = async () => {
      const res_tags = await getAllTags();
      if (res_tags instanceof Error) {
        setState("error");
        setError(res_tags); // blow me https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Feskipaper.com%2Fimages%2Fdandelion-pictures-1.jpg&f=1&nofb=1&ipt=fea4c3960765c74ebf122a21a237493189f3694a61c42338104f68cce357bec4
        return;
      }

      setTags(res_tags.filter((val) => val.trim().length > 1)); // there was a '.' in the result, I don't want that
      setState("loaded");
    };
    fetch_stuff();
  }, []);

  useEffect(() => {
    const fetch_stuff = async () => {
      const cats_url = getCatsURL({ tags: selectedTags });
      console.log(cats_url);
      let res_cats;
      try {
        res_cats = await fetch(cats_url);
      } catch {
        setLoadState("error");
        setError(
          new Error("There was an internet error while fetching the cats :("),
        );
        return;
      }
      if (!res_cats.ok) {
        setLoadState("error");
        setError(new Error("Could not fetch the cats :("));
        return;
      }

      setContent(await res_cats.json());
      setLoadState("loaded");
    };
    fetch_stuff();
  }, [selectedTags]);

  switch (state) {
    case "loading":
      return (
        <div className="w-screen h-screen">
          <div className="absolute translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2">
            The app is Loading
          </div>
        </div>
      );
    case "error":
      return <div>{error.message}</div>;
    case "loaded": {
      return (
        <div>
          <select
            onChange={(val) => {
              console.log(val.target.value);
            }}
            defaultValue={tags.length > 0 ? tags[0] : undefined}
          >
            {tags.map((val) => (
              <option value={val}>{val}</option>
            ))}
          </select>
          <div>
            {content.map((val) => (
              <img src={getExactCatURL({ id: val.id, type: "square" })} />
            ))}
          </div>
        </div>
      );
    }
  }
}

export default App;
