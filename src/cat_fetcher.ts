import { toast, type ExternalToast } from "sonner";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { State } from "./providers/CatProvider";

const pictureType = ["square", "medium", "small", "xsmall"] as const;
export type PictureType = (typeof pictureType)[number];

type CatPromptBase = {
  says?: string;
  type?: PictureType;
  /** will return the image binary by default */
  mode?: "html" | "json" | "binary";
};

export type RandomCatPrompt = {
  tags?: string[];
} & CatPromptBase;

export type ExactCatPrompt = {
  id: string;
} & CatPromptBase;

export type CatsApi = {
  limit?: number;
  skip?: number;
  tags?: string[];
};

export type CatSchema = {
  id: string;
  tags: string[];
  mimetype: string;
  createdAt: string;
};

export type SpecificCatSchema = CatSchema & { url: string };

export type CatCount = {
  count: number;
};

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
      props.mode && props.mode != "binary"
        ? props.mode == "json"
          ? "json=true"
          : "html=true"
        : undefined,
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
      props.mode && props.mode != "binary"
        ? props.mode == "json"
          ? "json=true"
          : "html=true"
        : undefined,
      props.type ? `type=${props.type}` : undefined,
    ]
      .filter((val) => val)
      .join("&")
    : ""; // slop
  return `https://cataas.com/cat${props.tags && props.tags.length > 0
      ? "/" +
      encodeURIComponent(`${props.tags.map((tag) => tag.trim()).join(",")}`)
      : ""
    }${says ? `/says/${says}` : ""}${extention}`; // absolute cinema
}

/// extra

export const cat_limit = 25;

const mockSchema = {
  id: "",
  createdAt: "",
  mimetype: "",
  tags: [],
} as const satisfies CatSchema;

const likes_key = "PussyFinder/likes";

export const loadLikesFromMemory = (): CatSchema[] | undefined => {
  try {
    const storageValsStr = localStorage.getItem(likes_key);
    if (!storageValsStr) return undefined;
    const storageValsUnknown = JSON.parse(storageValsStr) as CatSchema[];
    if (!Array.isArray(storageValsUnknown)) return undefined;
    const storageVals = storageValsUnknown as CatSchema[];
    const outPut = storageVals
      .map((storageVal) => {
        const keys = Object.keys(mockSchema);
        const objKeys = Object.keys(storageVal) as string[] | undefined;
        const valid = keys.every((key) => objKeys?.includes(key));
        return valid ? storageVal : undefined;
      })
      .filter((v) => v != undefined);
    return outPut;
  } catch {
    return undefined;
  }
};

export const saveLikesToMemory = (likes: CatSchema[]) => {
  localStorage.setItem(likes_key, JSON.stringify(likes));
};

export const defaultToast = (msg: string, data?: ExternalToast) =>
  toast(msg, {
    cancel: {
      label: "hide",
      onClick: () => { },
    },
    ...data,
  });

/// very clever play on fetch me their souls, please clap
export async function fetch_me_their_cats(
  args: CatsApi,
): Promise<CatSchema[] | Error> {
  const cats_url = getCatsURL(args);
  let res_cats;
  try {
    res_cats = await fetch(cats_url);
  } catch {
    return new Error("There was an internet error while fetching the cats :(");
  }
  if (!res_cats.ok) {
    return new Error("Could not fetch the cats :(");
  }

  return res_cats.json();
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const startCap = (str: string) =>
  str[0].toUpperCase() + str.substring(1);

// since I can't be bothered to actually make my own
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = <T>(arr: T[]): void =>
  [...Array(arr.length).keys()]
    .map((i) => [i, Math.floor(Math.random() * (i + 1))])
    .map(([i, j]) => ([arr[i], arr[j]] = [arr[j], arr[i]])) as unknown as void; // holy ts jank

export const useSuspensableImage = (
  src: string,
): UseSuspenseQueryResult<HTMLImageElement, Error> => {
  return useSuspenseQuery({
    queryKey: ["image", src],
    queryFn: () => {
      const promise = new Promise((res, err) => {
        const img = new Image();
        img.src = src;
        img.onload = () => res(img);
        img.onerror = err;
      });
      return promise;
    },
    subscribed: false,
    refetchInterval: false,
  });
};

// I just needed to execute a function on debounce :(
export function useDebounce<T>(
  val: T,
  ms: number,
  onDeb?: () => void,
): State<T> {
  const [changingVal, setChangingVal] = useState(val);
  const [debval, setDebVal] = useState(val);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebVal(changingVal);
      onDeb && onDeb();
    }, ms);

    return () => clearTimeout(handle);
  }, [changingVal, ms, onDeb]);

  return [debval, setChangingVal];
}
