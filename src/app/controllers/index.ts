import { Route } from "../interfaces/route";

export const IndexRoute: Route = {
  path: "/",
  method: "get",
  actions: [
    (_ctx) => {
      return {
        status: 200,
        body: { message: "Hello World!" },
      };
    },
  ],
};
