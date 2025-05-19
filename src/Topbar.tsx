import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme, type Theme } from "./components/theme-provider";

export default function Topbar() {
  const { theme, setTheme } = useTheme();

  const currentTheme: Exclude<Theme, "system"> = !(theme == "system")
    ? theme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  return (
    <div className="w-full border-b sticky top-0 bg-background flex">
      <div className="p-2">
        <i>
          <b>Pussy Finder</b>
        </i>
      </div>
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
