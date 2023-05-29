import {
  DocPageDocument,
  fetchDocPageByPath,
  fetchDocSectionByPath,
} from "../../../database/providers/docs";
import { DocPageModel } from "../../../database/schemas/docPage";
import { Route } from "../../interfaces/route";

export const createPageRoute: Route = {
  path: "/",
  method: "post",
  actions: [
    async (ctx) => {
      if (typeof ctx.req.body === "object")
        return {
          status: 400,
          body: {
            error: "Invalid body type",
          },
        };
      let { path, title, label, description, content } = ctx.req.body as any;
      if (!path || typeof path !== "string")
        return {
          status: 400,
          body: {
            error: "Invalid path provided",
          },
        };

      if (!title || typeof title !== "string")
        return {
          status: 400,
          body: {
            error: "Invalid title provided",
          },
        };

      if (!label || typeof label !== "string")
        return {
          status: 400,
          body: {
            error: "Invalid label provided",
          },
        };

      if (!description || typeof description !== "string")
        return {
          status: 400,
          body: {
            error: "Invalid description provided",
          },
        };

      if (!content || !Array.isArray(content))
        return {
          status: 400,
          body: {
            error: "Invalid content provided",
          },
        };

      const section = await fetchDocSectionByPath(path);

      if (path.startsWith("/")) path = path.slice(1, path.length);
      if (path.endsWith("/")) path = path.slice(0, -1);
      let pagePaths = path.split("/") as string[];
      pagePaths.shift();

      let finalPage: DocPageDocument | undefined = undefined;

      const mainPage = await DocPageModel.create({
        path: pagePaths[pagePaths.length - 1],
        title,
        label,
        description,
        content: content,
      });

      pagePaths.pop();

      for (const pagePath of pagePaths) {
        // Create sub pages for contents
      }

      if (finalPage) {
        return {
          status: 200,
          body: finalPage,
        };
      }

      return {
        status: 500,
        body: {
          error: "Something went wrong",
        },
      };
    },
  ],
};
