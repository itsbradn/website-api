import { Route } from "../../interfaces/route";

export const getPlayerRoute: Route = {
  path: "/player/:player",
  method: "get",
  actions: [
    async (ctx) => {
      const player = ctx.req.params.player;
      if (!player) {
        return {
          status: 401,
          body: {
            error: "Invalid player",
          },
        };
      }

      console.log(player);

      return {
        status: 400,
        body: {
          error: "Internal Server Error",
        },
      };
    },
  ],
};
