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

export const fetchDocSectionByPath = async (path: string) => {
  if (path.startsWith("/")) path = path.slice(1, path.length);
  if (path.endsWith("/")) path = path.slice(0, -1);

  let sectionPath = path.includes("/") ? path.split("/")[0] : path;
  const section = await fetchDocSection(sectionPath);
  if (!section) throw new Error("No section found");

  return section;
}

export const fetchDocPageByPath = async (path: string) => {
  if (path.startsWith("/")) path = path.slice(1, path.length);
  if (path.endsWith("/")) path = path.slice(0, -1);

  let sectionPath = path.includes("/") ? path.split("/")[0] : path;
  let pagePaths = path.split("/");
  pagePaths.shift();

  const section = await fetchDocSection(sectionPath);
  if (!section) throw new Error("No section found");

  let childIds: Types.ObjectId[] = [];

  let searchArray = (arr: PageType[]) => {
    for (const val of arr) {
      if (val.children) searchArray(val.children);
      else childIds.push(val.id._id);
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
      const child = docPages.find((v) => {
        return v._id.equals(childId.id);
      });
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
  console.log(final);

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
        value: docPages.find((z) => z._id.equals(v.id))?.label,
      };
    }) as ContentItem[];
  };

  let contents: ContentItem[] = convertContents(section.pages);

  const sanitizePage = ({
    title,
    label,
    description,
    content,
  }: {
    title: string;
    label: string;
    description: string;
    content: any[];
  }) => ({
    title,
    label,
    description,
    content,
  });

  const finalPage = docPages.find((v) => v._id.equals(final?.id ?? ""));
  if (!finalPage) throw new Error("Page not found");

  return {
    page: sanitizePage(finalPage),
    sectionContents: contents,
  };
};
