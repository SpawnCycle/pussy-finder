import { createContext, useContext, useState, type ReactNode } from "react";
import type { State } from "@/providers/CatProvider";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const contentTypes = {
  browse: {
    description: `Browse all types of cats, make them say something, filter them by tags`,
    help: (
      <div>
        <DialogHeader className="mb-2">
          <DialogTitle>You need help?</DialogTitle>
          <DialogDescription>
            Here you can get the help you need!
          </DialogDescription>
        </DialogHeader>
        <div>This is the best website in the world.</div>
        <div>
          To not use this website to its full potential is to waste your own.
        </div>
        <div>
          With the help of this website you can finally see some pussies.
        </div>
        <div>
          To start off, you can fine-tune the pussies shown by setting tags
          according to your tastes.
        </div>
        <div>
          By clicking on the badge with a tag on it you can remove it from your
          selected filters.
        </div>
        <div>
          While searching for a tag you can press <i>Enter</i> to select the
          highlighted tag.
        </div>
        <div>
          Also while searching for a tag you can press <i>Escape</i> to exit the
          tag selection.
        </div>
        <div>
          If you see a pussy you like click the image to show a menu and turn
          your pussy's purrs into words.
        </div>
        <div>
          You can submit and escape that menu the same way as you would the tag
          selection.
        </div>
        <div>
          Besides the pictures there's a <b>Give me more</b> button at the
          bottom of the page.
        </div>
        <div>
          If you press that button the website will show you even more pussies
          based on your filters.
        </div>
        <div>
          Besides the aforementioned features, the website also contains some
          smaller ones such as: <b>Daily cat fact</b> and <b>Theme switching</b>
          .
        </div>
      </div>
    ),
  },
  swipe: {
    description: `Swipe right on the cats you like to save them for later`,
    help: (
      <div>
        <DialogHeader className="mb-2">
          <DialogTitle>You need help?</DialogTitle>
          <DialogDescription>
            Here you can get the help you need!
          </DialogDescription>
        </DialogHeader>
        <div>So you've decided to swipe some pussy.</div>
        <div>
          Worry not, with this pussy swiper, you might just find the pussy you
          want most.
        </div>
        <div>
          As painful as it was, the swiper is usable on mobile, somewhat
          enjoyable even.
        </div>
        <div>
          You can swipe or finger (or cursor) to like and skip pussies, or you
          can use the buttons, labeled accordingly.
        </div>
        <div>
          If a pussy really catches your fancy, you don't need to wait to go to
          the liked section, you can press it right there and it'll show you a
          menu where you can see it in better resolution and furthermore you can
          make it say something.
        </div>
        <div>
          As with other sections, you can filter pussies by tags to find the
          perfect pussy for you.
        </div>
      </div>
    ),
  },
  liked: {
    description: "Here you can view the cats you liked in the Swipe mode",
    help: (
      <div>
        <DialogHeader className="mb-2">
          <DialogTitle>You need help?</DialogTitle>
          <DialogDescription>
            Here you can get the help you need!
          </DialogDescription>
        </DialogHeader>
        <div>
          Welcome to your likes, here you can see the pussies you liked and if
          you change your mind, you can remove them from your likes by pressing
          the broken heart button in the top left corner of the pussy card.
        </div>
        <div>
          If you have a big and important collection of pussies and you don't
          want to scroll through all of them just to get to your favorite, you
          can use the oh so familiar pussy filter to aid you in finding the
          appropriate pussy.
        </div>
        <div>
          Unlike the other sections, your likes has a little trick to aid you in
          your search for your favorite pussy, by pressing one of many tags
          below the pussy pictures, you can apply that tag as the filter and
          find the perfect pussy that much quicker.
        </div>
      </div>
    ),
  },
} as const;
export type ContentT = keyof typeof contentTypes; // types galore, actually useful to do it like this btw, crazy

const ContentTypeCtx = createContext<State<ContentT> | undefined>(undefined);

export default function ContentTypeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const contentState = useState<ContentT>("browse");
  return (
    <ContentTypeCtx.Provider value={contentState}>
      {children}
    </ContentTypeCtx.Provider>
  );
}

export function useContentType() {
  const contentState = useContext(ContentTypeCtx);
  if (!contentState) throw "Can't use Content Type context without a provider";
  return contentState;
}
