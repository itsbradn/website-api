import { Types } from "mongoose";

export interface Page {
  id: Types.ObjectId;
  label: undefined;
  children: undefined;
}

interface DropPage {
  id: undefined;
  label: string;
  children: Page[];
}

export type PageType = Page | DropPage;

export interface DocSection {
  path: string; // Should not start or end with /
  title: string; // Title for page header
  label: string; // Label for side bar
  pages: PageType[];
}
