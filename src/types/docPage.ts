export interface DocPage {
  section: string | undefined; // Should not start or end with /
  path: string; // Should not start or end with /
  /**
   * Path calc:
   *
   * Path is calculated as follows:
   * /docs/{section}/{...path}
   *
   * If section is undefined it will be calculated as follows:
   * /docs/{...path}
   */

  title: string; // Title for page header
  label: string; // Label for sidebar
  description: string; // Page description for SEO
  parent?: {
    label: string;
    isDrop: boolean;
  };

  content: Buffer;
}

type DocContent =
  | ContentHeading1
  | ContentHeading2
  | ContentHeading3
  | ContentHeading4
  | ContentHeading5
  | ContentParagraph
  | ContentLink
  | ContentDivider;

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
