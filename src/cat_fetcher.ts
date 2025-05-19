import type { CatContext } from "./CatProvider";

const pictureType = ["square", "medium", "small", "xsmall"] as const;
export type PictureType = (typeof pictureType)[number];

interface CatPromptBase {
  says?: string;
  type?: PictureType;
  /** will return the image binary by default */
  mode?: "html" | "json" | "binary";
}

export interface RandomCatPrompt extends CatPromptBase {
  tags?: string[];
}

export interface ExactCatPrompt extends CatPromptBase {
  id: string;
}

export interface CatsApi {
  limit?: number;
  skip?: number;
  tags?: string[];
}

export interface CatSchema {
  id: string;
  tags: string[];
  mimetype: string;
  createdAt: string;
}

export interface CatCount {
  count: number;
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getAllTags(): Promise<string[] | Error> {
  try {
    const res = await fetch("https://cataas.com/api/tags");
    if (!res.ok) {
      return new Error("Failed to fetch tags");
    }
    return await res.json();
  } catch {
    return new Error("Internet error while trying to fetch tags");
  }
}

export async function getCatCount(): Promise<CatCount | Error> {
  try {
    const res = await fetch("https://cataas.com/api/count");
    if (!res.ok) {
      return new Error("Failed to fetch cat count");
    }
    return await res.json();
  } catch {
    return new Error("Internet error while trying to fetch count");
  }
}

export function getCatsURL({ skip, limit, tags }: CatsApi): string {
  const extention = !(skip || limit || tags)
    ? ""
    : "?" +
      [
        skip ? `skip=${skip}` : undefined,
        limit ? `limit=${limit}` : undefined,
        tags ? "tags=" + encodeURIComponent(`${tags?.join(",")}`) : undefined,
      ]
        .filter((val) => val)
        .join("&"); // holy functional garbage
  return `https://cataas.com/api/cats${extention}`;
}

export function getExactCatURL({ id, says, ...props }: ExactCatPrompt): string {
  const extention = Object.values(props).some((val) => val != null)
    ? "?" +
      [
        props.mode && props.mode != "binary" ? `mode=${props.mode}` : undefined,
        props.type ? `type=${props.type}` : undefined,
      ]
        .filter((val) => val)
        .join("&")
    : ""; // slop
  return `https://cataas.com/cat/${id}${says ? `/says/${says}` : ""}${extention}`; // absolute cinema
}

export function getRandomCatURL({ says, ...props }: RandomCatPrompt): string {
  const extention = Object.values(props).some((val) => val != null)
    ? "?" +
      [
        props.mode && props.mode != "binary" ? `mode = ${props.mode} ` : null,
        props.type ? `type = ${props.type} ` : null,
        props.tags ? "tags=" + encodeURIComponent(`${props.type} `) : null,
      ]
        .filter((val) => val)
        .join("&")
    : ""; // slop
  return `https://cataas.com/cat${says ? `/says/${says}` : null}${extention}`; // absolute cinema
}

/// extra

export async function fetch_me_their_cats( // very clever play on fetch me their souls, please clap
  args: Omit<CatsApi, "tags">,
  ctx: CatContext,
): Promise<CatSchema[] | null> {
  const [selectedTags, _setSelectedTags] = ctx.selectedTags;
  const [_loadState, setLoadState] = ctx.loadState;
  const [_error, setError] = ctx.appError;

  const cats_url = getCatsURL({ tags: selectedTags, ...args });
  let res_cats;
  try {
    res_cats = await fetch(cats_url);
  } catch {
    setLoadState("error");
    setError(
      new Error("There was an internet error while fetching the cats :("),
    );
    return null;
  }
  if (!res_cats.ok) {
    setLoadState("error");
    setError(new Error("Could not fetch the cats :("));
    return null;
  }

  setLoadState("loaded");
  return await res_cats.json();
}
