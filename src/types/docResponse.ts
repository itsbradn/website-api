
interface ContentTitle {
  type: "title";
  value: string;
}

interface ContentLink {
  type: "link";
  value: string;
  toSlug?: string;
}

interface ContentDrop {
  type: "drop";
  value: string;
  children: ContentItem[];
}

export type ContentItem = ContentTitle | ContentLink | ContentDrop;

export interface DocResponse {
  contents: ContentItem[],
}