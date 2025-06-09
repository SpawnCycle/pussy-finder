import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme, type Theme } from "@/components/theme-provider";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCats } from "./CatProvider";
import { Button } from "@/components/ui/button";
import Help from "./Help";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./components/ui/navigation-menu";
import { contentTypes, useContentType } from "./ContentTypeProvider";
import { defaultToast, startCap } from "./cat_fetcher";

export default function Topbar() {
  const ctx = useCats();
  const [fact, _setFact] = ctx.catFact;
  const { theme, setTheme } = useTheme();
  const [contentType, setContentType] = useContentType();

  const currentTheme: Exclude<Theme, "system"> = !(theme == "system")
    ? theme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  return (
    <div className="w-full border-b sticky top-0 bg-background flex z-10">
      <NavigationMenu viewport={true}>
        <NavigationMenuList className="gap-0">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <div className="p-2 my-0.15 hover:cursor-pointer">
                <i>
                  <b>Pussy Finder</b>
                </i>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {contentTypes.map((content) => (
                <NavigationMenuLink asChild>
                  <a
                    className="hover:cursor-pointer w-[200px] max-w-[75vw]"
                    onClick={() => {
                      if (content.type === contentType)
                        return defaultToast("You're already here silly");
                      setContentType(content.type);
                    }}
                  >
                    <div className="text-lg font-bold mb-2.5">
                      {startCap(content.type)}
                    </div>
                    <div className="leading-tight text-muted-foreground w-fit">
                      {content.description}
                    </div>
                  </a>
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          {fact && (
            <NavigationMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mx-2 my-1 hover:cursor-pointer"
                    variant={"ghost"}
                  >
                    Daily cat fact
                  </Button>
                </DialogTrigger>
                <DialogContent>{fact}</DialogContent>
              </Dialog>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="mx-2 my-1 hover:cursor-pointer"
                  variant={"ghost"}
                >
                  Help
                </Button>
              </DialogTrigger>
              <DialogContent>
                <Help />
              </DialogContent>
            </Dialog>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="py-2 pr-1 sm:pr-2 ml-auto flex">
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
