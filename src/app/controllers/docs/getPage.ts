import { Route } from "../../interfaces/route";

export const getPageRoute: Route = {
  path: "/",
  method: "get",
  actions: [
    (ctx) => {
      const path = ctx.req.params.path;
      if (!path)
        return {
          status: 400,
          body: {
            error: "No path provided",
          },
        };

      
      
      
      return {
        status: 500,
        body: {
          error: "Something went wrong",
        },
      };
    },
  ],
};
