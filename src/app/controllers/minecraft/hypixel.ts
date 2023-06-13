import axios from "axios";
import { Route } from "../../interfaces/route";
import {
  calculateLevelData,
  calculateLevelFromExp,
} from "../../../services/hypixel/level";
import { formatTntGamesStats } from "../../../services/hypixel/tntgames";

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

      try {
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
          body: {
            ...hypixelReq.data.player,
            ...calculateLevelData(hypixelReq.data.player.networkExp),
            games: {
              ...formatTntGamesStats(hypixelReq.data.player),
            },
          },
        };
      } catch (e) {
        console.log(e);
        return {
          status: 400,
          body: {
            error: "Internal Server Error",
          },
        };
      }
    },
  ],
};
