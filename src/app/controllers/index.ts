import { Route } from "../interfaces/route.ts";

export const IndexRoute: Route = {
  path: "/",
  method: "GET",
  actions: [
    (_ctx) => {
      return {
        status: 200,
        body: { message: "Hellow World!" },
      };
    },
  ],
};
