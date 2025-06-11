import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getExactCatURL, type CatSchema } from "./cat_fetcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "./components/ui/skeleton";
import SuspendedImage from "./SuspendedImage";
import ExtraTag from "./ExtraTag";
import { useCats } from "./CatProvider";

interface DresserContext {
  openDresser: (id: CatSchema) => void;
}

const DresserCtx = createContext<DresserContext | undefined>(undefined);

export function CatDresser({ children }: { children: ReactNode }) {
  const ctx = useCats();
  const [_selectedTags, setSelectedTags] = ctx.selectedTags;
  const [catSchema, setCatSchema] = useState<CatSchema | undefined>(undefined);
  const [active, setActive] = useState<boolean>(false);
  const [says, setSays] = useState<string>("");
  const saysVal = useRef("");

  const setActiveSays = () => {
    setSays(saysVal.current);
  };

  useEffect(() => {
    const key_ev = (ev: KeyboardEvent) => {
      if (ev.key == "Escape") setActive(false);
    };

    document.addEventListener("keyup", key_ev);

    return () => document.removeEventListener("keyup", key_ev);
  }, []);

  return (
    <DresserCtx.Provider
      value={{
        openDresser: (schema) => {
          setCatSchema(schema);
          setActive(true);
        },
      }}
    >
      {children}
      {active && (
        <div
          className="fixed top-0 left-0 w-screen h-screen backdrop-blur-lg z-15"
          onClick={() => setActive(false)}
        />
      )}
      <div
        className={`fixed translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 
        max-w-[90%] bg-card rounded-md p-3 z-25
        ${active ? "" : "hidden"}`}
      >
        <Dialog>
          <DialogHeader>
            <DialogTitle>Silly cat</DialogTitle>
            <DialogDescription>Make it say something</DialogDescription>
          </DialogHeader>
          <div className="relative">
            {active && catSchema && (
              <Suspense
                fallback={<Skeleton className="max-h-[75vh] aspect-square" />}
              >
                <SuspendedImage
                  className="max-w-[75vw] max-h-[50vh] m-auto"
                  src={getExactCatURL({
                    id: catSchema.id,
                    says,
                    type: "medium",
                  })}
                />
              </Suspense>
            )}
            <div className="my-1">
              {catSchema &&
                catSchema.tags.map((tag) => (
                  <ExtraTag
                    tag={tag}
                    className="mx-1"
                    onClick={() => {
                      setSelectedTags((tags) =>
                        tags.some((v) => v == tag) ? tags : [...tags, tag],
                      );
                    }}
                  />
                ))}
            </div>
            <Input
              className="my-2"
              onChange={(ev) => (saysVal.current = ev.target.value)}
              defaultValue={saysVal.current}
              placeholder="Meow meow"
              onKeyDown={(ev) => {
                if (ev.key == "Enter") setActiveSays();
              }}
            />
            <div className="flex">
              <Button
                className="mr-auto ml-2 my-3"
                onClick={setActiveSays}
                variant={"default"}
              >
                Add text
              </Button>
              <Button
                className="ml-auto mr-2 my-3"
                onClick={() => setActive(false)}
                variant={"secondary"}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </DresserCtx.Provider>
  );
}

export function useDresser() {
  const ctx = useContext(DresserCtx);
  if (!ctx) throw "The dresser doesn't work ;-;";
  return ctx;
}
