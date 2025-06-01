import { useDresser } from "./CatDresser";
import { getExactCatURL, type CatSchema } from "./cat_fetcher";

export default function CatCard({ schema }: { schema: CatSchema }) {
  const dresser = useDresser();

  return (
    <img
      key={schema.id}
      className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] border rounded"
      onClick={() => {
        dresser.openDresser(schema.id);
      }}
      src={getExactCatURL({
        id: schema.id,
        type: "square",
      })}
    />
  );
}
