import { Types } from "mongoose";

export interface DocPage {
  path: string;
  title: string; // Title for page header
  label: string; // Label for sidebar
  description: string; // Page description for SEO
  content: DocContent[];
}

export type DocContent =
  | ContentHeading1
  | ContentHeading2
  | ContentHeading3
  | ContentHeading4
  | ContentHeading5
  | ContentParagraph
  | ContentLink
  | ContentDivider
  | ContentInlineCode
  | ContentCode;

interface ContentHeading1 {
  type: "h1";
  value: DocContent[];
}

interface ContentHeading2 {
  type: "h2";
  value: DocContent[];
}

interface ContentHeading3 {
  type: "h3";
  value: DocContent[];
}

interface ContentHeading4 {
  type: "h4";
  value: DocContent[];
}

interface ContentHeading5 {
  type: "h5";
  value: DocContent[];
}

interface ContentParagraph {
  type: "p";
  value: DocContent[];
}

interface ContentLink {
  type: "p";
  link: string;
  value: DocContent[];
}

interface ContentDivider {
  type: "divider";
}

interface ContentInlineCode {
  type: "inline-code";
  value: string;
}

interface ContentCode {
  type: "code";
  value: string;
}
