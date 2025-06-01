import Tagger from "./Tagger";
import Topbar from "./Topbar";
import BrowseContent from "./BrowseContent";
import { useContentType } from "./ContentTypeProvider";
import type { HTMLProps } from "react";
import SwipeContent from "./SwipeContent";

export const cat_limit = 25;

function CurrentContent() {
  const [content, _] = useContentType();
  switch (content) {
    default:
    case "browse":
      return BrowseContent;
    case "swipe":
      return SwipeContent;
  }
}

export default function Content() {
  const ActiveContent = CurrentContent(); // react jank
  return (
    <div>
      <Topbar />
      <Tagger />
      <ActiveContent className="mx-5" />
    </div>
  );
}
