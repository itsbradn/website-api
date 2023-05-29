import { fetchDocPageByPath } from "../../../database/providers/docs";
import { Route } from "../../interfaces/route";

export const getPageRoute: Route = {
  path: "/",
  method: "get",
  actions: [
    async (ctx) => {
      const path = ctx.req.query.path;
      if (!path || typeof path !== "string")
        return {
          status: 400,
          body: {
            error: "No path provided",
          },
        };

      const doc = await fetchDocPageByPath(path);

      if (doc.page) {
        return {
          status: 200,
          body: doc,
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
