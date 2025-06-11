import Tagger from "./Tagger";
import Topbar from "./Topbar";
import BrowseContent from "./BrowseContent";
import { useContentType } from "./ContentTypeProvider";
import SwipeContent from "./SwipeContent";
import LikedContent from "./LikedContent";

export const cat_limit = 25;

function CurrentContent() {
  const [content, _] = useContentType();
  switch (content) {
    default:
    case "browse":
      return BrowseContent;
    case "swipe":
      return SwipeContent;
    case "liked":
      return LikedContent;
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
