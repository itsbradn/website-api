import { Document, Types } from "mongoose";
import { DocPage } from "../../types/docPage";
import { DocSection, Page, PageType } from "../../types/docSection";
import { DocSectionModel } from "../schemas/docSection";
import { DocPageModel } from "../schemas/docPage";
import { ContentItem } from "../../types/docResponse";

export type DocPageDocument = Document<unknown, {}, DocPage> &
  Omit<DocPage & { _id: Types.ObjectId }, never>;

export type DocSectionDocument = Document<unknown, {}, DocSection> &
  Omit<DocSection & { _id: Types.ObjectId }, never>;

export const fetchDocSection = async (
  path: string
): Promise<DocSectionDocument | null> =>
  await DocSectionModel.findOne({ path });

export const fetchDocPage = async (
  id: Types.ObjectId
): Promise<DocPageDocument | null> => await DocPageModel.findById(id);

export const fetchDocPageByPath = async (fullPath: string) => {
  let path = fullPath.startsWith("/") ? fullPath.slice(0, 1) : fullPath;
  path = path.endsWith("/") ? path.slice(0, -1) : path;

  let sectionPath = path.includes("/") ? path.split("/")[0] : path;
  let pagePaths = path.split("/");
  pagePaths.shift();

  const section = await fetchDocSection(sectionPath);
  if (!section) throw new Error("No section found");

  let childIds: Types.ObjectId[] = [];

  let searchArray = (arr: PageType[]) => {
    for (const val of arr) {
      if (val.children) searchArray(val.children);
      else childIds.push(val.id);
    }
  };

  searchArray(section.pages);

  const docPages = await DocPageModel.find({ _id: { $in: childIds } });

  let arrayToSearch: PageType[] = section.pages;

  const findNextPage = (
    path: string,
    arr: PageType[]
  ): Page | PageType[] | undefined => {
    for (const childId of arr) {
      if (childId.children) return childId.children;
      const child = docPages.find((v) => v._id === childId.id);
      if (!child) continue;
      if (child.path !== path) continue;

      return childId;
    }
  };

  let final: Page | undefined = undefined;

  for (const pagePath of pagePaths) {
    const res = findNextPage(pagePath, arrayToSearch);
    if (!res) break;
    if (Array.isArray(res)) arrayToSearch = res;
    else final = res;
  }

  if (!final) final = arrayToSearch.find((v) => v.id !== undefined) as Page;

  const convertContents = (arr: PageType[]): ContentItem[] => {
    return arr.map((v) => {
      if (v.children)
        return {
          type: "drop",
          value: v.label,
          children: convertContents(v.children),
        };
      return {
        type: "link",
        value: docPages.find((z) => z._id === v.id)?.label,
      };
    }) as ContentItem[];
  };

  let contents: ContentItem[] = convertContents(section.pages);

  return {
    page: docPages.find((v) => v._id === final?.id),
    sectionContents: contents,
  };
};
