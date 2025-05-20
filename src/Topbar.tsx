import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme, type Theme } from "@/components/theme-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCats } from "./CatProvider";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const ctx = useCats();
  const [fact, _setFact] = ctx.catFact;
  const { theme, setTheme } = useTheme();

  const currentTheme: Exclude<Theme, "system"> = !(theme == "system")
    ? theme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  return (
    <div className="w-full border-b sticky top-0 bg-background flex">
      <div className="p-2 my-0.15">
        <i>
          <b>Pussy Finder</b>
        </i>
      </div>
      {fact ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mx-2 my-1" variant={"ghost"}>
              Daily cat fact
            </Button>
          </DialogTrigger>
          <DialogContent>{fact}</DialogContent>
        </Dialog>
      ) : (
        ""
      )}
      <div className="p-2 ml-auto flex">
        <Label htmlFor="theme-toggle">
          {currentTheme == "dark" ? "🌘" : "🌞"}
        </Label>
        <Switch
          className="m-1" // trust me bro
          id="theme-toggle"
          onCheckedChange={(toggled) =>
            toggled ? setTheme("dark") : setTheme("light")
          }
          defaultChecked={true}
        />
      </div>
    </div>
  );
}
