import { useEffect, useState } from "react";
import { getAllTags, getCatsURL } from "./cat_fetcher";
import Content, { cat_limit } from "./Content";
import { useCats, type LoadState } from "./CatProvider";
import CatWarning from "./CatWarning";

function App() {
  const ctx = useCats();
  const [tags, setTags] = ctx.tags;
  const [state, setState] = ctx.appState;
  const [error, setError] = ctx.fatalAppError;
  const [fact, setFact] = ctx.catFact;
  const [warnings, setWarnings] = ctx.warnings;

  useEffect(() => {
    const async_fn = async () => {
      const res_tags = await getAllTags();
      if (res_tags instanceof Error) {
        setState("error");
        setError(res_tags.message); // blow me https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Feskipaper.com%2Fimages%2Fdandelion-pictures-1.jpg&f=1&nofb=1&ipt=fea4c3960765c74ebf122a21a237493189f3694a61c42338104f68cce357bec4
        return;
      }

      const f_tags = res_tags.filter((val) => val.trim().length > 1);
      setTags(f_tags); // there was a '.' in the result, I don't want that
      setState("loaded");
    };
    async_fn();
  }, []);

  useEffect(() => {
    const async_fn = async () => {
      const cats_url = "https://meowfacts.herokuapp.com/";
      let res_cats;
      try {
        res_cats = await fetch(cats_url);
      } catch {
        setWarnings((warnings) => [
          ...warnings,
          new Error("There was an internet error while fetching cat facts :("),
        ]);
        return;
      }
      if (!res_cats.ok) {
        const msg = "There was an error while fetching the cat facts :(";
        setWarnings((warnings) => [...warnings, new Error(msg)]);
        console.log(msg);
        return;
      }
      const fact_data = (await res_cats.json()) as { data: string[] };
      setFact(fact_data.data[0]);
    };
    async_fn();
  }, []);

  switch (state) {
    case "loading":
      return (
        <div className="w-screen h-screen">
          <div className="absolute translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2">
            Loading the basics...
          </div>
        </div>
      );
    case "error":
      return (
        <div className="w-screen h-screen">
          <div className="absolute translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 text-red-600">
            {error}
          </div>
        </div>
      );
    case "loaded": {
      return (
        <>
          <CatWarning />
          <Content />
        </>
      );
    }
  }
}

export default App;
