import axios from "axios";
import { Route } from "../../interfaces/route";

export const getHypixelRoute: Route = {
  path: "/hypixel/:uuid",
  method: "get",
  actions: [
    async (ctx) => {
      const uuid = ctx.req.params.uuid;
      if (!uuid) {
        return {
          status: 401,
          body: {
            error: "Invalid player",
          },
        };
      }

      const hypixelReq = await axios.get(
        "https://api.hypixel.net/player?uuid=" + uuid,
        {
          headers: {
            "API-Key": process.env.HYPIXEL_KEY!,
          },
        }
      );

      if (hypixelReq.data.success !== true) {
        return {
          status: 401,
          body: {
            error: hypixelReq.data.cause,
          },
        };
      }

      return {
        status: 200,
        body: hypixelReq.data,
      };
    },
  ],
};
