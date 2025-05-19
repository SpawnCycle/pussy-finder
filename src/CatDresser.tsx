import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getExactCatURL } from "./cat_fetcher";
import type { State } from "./CatProvider";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

interface DresserContext {
  openDresser: (id: string) => void;
}

const DresserCtx = createContext<DresserContext | undefined>(undefined);

export function CatDresser({ children }: { children: ReactNode }) {
  const [catId, setCatId] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [saysVal, setSaysVal] = useState<string>("");
  const [says, setSays] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  const setActiveSays = () => {
    setSays(saysVal);
  };

  useEffect(() => {
    const ev_handler = (ev: MouseEvent) => {
      if (ref.current?.classList.contains("hidden"))
        return (opened.current = false);
      if (!opened.current) return (opened.current = true);
      // ^ absolute shit ^ but it works

      if (ref && !ref.current!.contains(ev.target as Node)) {
        console.log("not active anymore");
        opened.current = false;
        setActive(false);
      }
    };
    document.addEventListener("click", ev_handler);

    return () => {
      document.removeEventListener("click", ev_handler);
    };
  }, []);

  return (
    <DresserCtx.Provider
      value={{
        openDresser: (id) => {
          console.log("opening dresser");
          setCatId(id);
          setActive(true);
        },
      }}
    >
      {children}
      <div
        ref={ref}
        className={`absolute translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 
        min-w-[400px] min-h-[250px] max-w-3/5 max-h-4/5 bg-card rounded-md
        p-3 
        ${active ? "" : "hidden"}`}
      >
        <Dialog>
          <DialogHeader>
            <DialogTitle>Silly cat</DialogTitle>
            <DialogDescription>Make it say something</DialogDescription>
          </DialogHeader>
          <div className="w-full h-full relative">
            {!active ? (
              ""
            ) : (
              <div className="w-full h-full">
                <img
                  className="max-h-[calc(100vh/2)] max-w-full m-auto"
                  src={getExactCatURL({ id: catId, says })}
                />
              </div>
            )}
            <Input
              className="my-2"
              onChange={(ev) => setSaysVal(ev.target.value)}
              value={saysVal}
              placeholder="Meow meow"
            />
            <div className="flex">
              <Button
                className="mr-auto ml-2 my-3"
                onClick={setActiveSays}
                variant={"default"}
              >
                Submit
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
