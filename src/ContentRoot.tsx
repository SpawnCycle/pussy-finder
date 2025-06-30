import Tagger from "@/generic/Tagger";
import Topbar from "@/misc/Topbar";
import BrowseContent from "@/BrowseContent";
import { useContentType } from "@/providers/ContentTypeProvider";
import SwipeContent from "@/swipe/SwipeContent";
import LikedContent from "@/LikedContent";

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
