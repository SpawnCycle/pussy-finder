import type { HTMLProps } from "react";
import { contentTypes, useContentType } from "@/providers/ContentTypeProvider";

type HelpProps = {} & Omit<HTMLProps<HTMLDivElement>, "children">;

export default function Help(props: HelpProps) {
  const [contentType, _setContentType] = useContentType();

  return <div {...props}>{contentTypes[contentType].help}</div>;
}
