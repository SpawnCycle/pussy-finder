import type { HTMLProps } from "react";
import { useCats } from "./CatProvider";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

type HelpProps = {} & Omit<HTMLProps<HTMLDivElement>, "children">;

export default function Help(props: HelpProps) {
  const ctx = useCats();
  const [facts, _setFacts] = ctx.catFact;

  return (
    <div {...props}>
      <DialogHeader className="mb-2">
        <DialogTitle>You need help?</DialogTitle>
        <DialogDescription>
          Here you can get the help you need
        </DialogDescription>
      </DialogHeader>
      <div>This is the best website in the world.</div>
      <div>
        To not use this website to its full potential is to waste your own.
      </div>
      <div>
        {" "}
        With the help of this website you can finally see some pussies.
      </div>
      <div>
        To start off, you can adjust the shown pussies by setting tags according
        to your tastes.
      </div>
      <div>
        By clicking on the badge with a tag on it you can remove it from your
        selected filters.
      </div>
      <div>
        While searching for a tag you can press <i>Enter</i> to select the first
        shown tag.
      </div>
      <div>
        Also while searching for a tag you can press <i>Escape</i> to exit the
        tag selection.
      </div>
      <div>
        If you see a pussy you like you can click on the image to show a menu
        where you can make it say something.
      </div>
      <div>
        You can submit and escape that menu the same way as you would the tag
        selection.
      </div>
      <div>
        Besides the pictures there is a <b>Give me more</b> button at the bottom
        of the page.
      </div>
      <div>
        If you press that button the website will show you even more pussies
        based on your filters.
      </div>
      <div>
        Besides the aforementioned features the website also contains some
        smaller ones such as: <b>Daily cat fact</b> and <b>Theme switching</b>.
      </div>
    </div>
  );
}
