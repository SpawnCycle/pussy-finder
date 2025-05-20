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

  const setActiveSays = () => {
    setSays(saysVal);
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
        openDresser: (id) => {
          setCatId(id);
          setActive(true);
        },
      }}
    >
      {children}
      {active ? (
        <div
          className={"fixed top-0 left-0 w-screen h-screen backdrop-blur-lg"}
          onClick={() => setActive(false)}
        />
      ) : (
        ""
      )}
      <div
        className={`fixed translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 
        md:min-w-[400px] md:min-h-[250px] min-w-4/5 md:max-w-3/5 md:max-h-4/5 max-w-[90%] bg-card rounded-md
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
