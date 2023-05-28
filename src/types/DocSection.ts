import { Types } from "mongoose";

interface PageChild {
  id: Types.ObjectId,
  children?: Page[],
}
interface Page {
  id: Types.ObjectId,
  children?: PageChild[],
}

export interface DocSection {
  path: string; // Should not start or end with /
  title: string; // Title for page header
  label: string; // Label for side bar
  pages: Page[];
}
