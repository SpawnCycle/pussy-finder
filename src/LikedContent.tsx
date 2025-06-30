import type { ComponentProps } from "react";
import { useCats } from "@/providers/CatProvider";
import CatCard from "@/generic/CatCard";
import ExtraTag from "@/generic/ExtraTag";
import { Button } from "@/components/ui/button";
import { FaHeartBroken } from "react-icons/fa";
import { useContentType } from "@/providers/ContentTypeProvider";

type LikedContentProps = {} & Omit<ComponentProps<"div">, "children">;

export default function LikedContent(props: LikedContentProps) {
  const ctx = useCats();
  const [selectedTags, setSelectedTags] = ctx.selectedTags;
  const [liked, setLiked] = ctx.likedCats;
  const [_contentType, setContentType] = useContentType();

  const likeFiltered = liked.filter(
    (like) =>
      selectedTags.length == 0 ||
      like.tags.some((tag) => selectedTags.includes(tag)),
  );

  return (
    <div {...props}>
      <div className="flex gap-5 max-sm:gap-3 flex-wrap w-full min-h-[60vh] justify-evenly">
        {likeFiltered.length > 0 &&
          likeFiltered.map((cat) => (
            <div className="">
              <div className="relative w-fit">
                <CatCard
                  schema={cat}
                  cardType="medium"
                  className="w-auto max-h-[400px]"
                />
                <Button
                  variant={"default"}
                  className="text-muted-foreground bg-muted/50 hover:cursor-pointer hover:bg-muted hover:text-foreground absolute top-[calc(var(--spacing)*3+5px)] right-[calc(var(--spacing)*3+5px)]"
                  onClick={() =>
                    setLiked((likes) =>
                      likes.filter((like) => like.id != cat.id),
                    )
                  }
                >
                  <FaHeartBroken />
                </Button>
              </div>
              <div className="flex flex-wrap max-w-[200px]">
                {cat.tags.length > 0 && (
                  <div className="mt-2">
                    {cat.tags.map((tag) => (
                      <ExtraTag
                        tag={tag}
                        onClick={() => {
                          setSelectedTags((tags) =>
                            tags.some((t) => t == tag) ? tags : [...tags, tag],
                          );
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        {likeFiltered.length == 0 && (
          <div className="m-auto">
            <div>You have not liked any pussies so far :(</div>
            <div>
              <Button
                variant={"secondary"}
                className="hover:cursor-pointer hover:text-background hover:bg-muted-foreground"
                onClick={() => setContentType("swipe")}
              >
                Go like some
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
