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

        const pre = -(10000 - 0.5 * 2500) / 2500;
        const pre2 = pre * pre;
        const growthDivides = 2 / 2500;
        const num =
          1 +
          pre +
          Math.sqrt(pre2 + growthDivides * hypixelReq.data.player.networkExp);
        const level = Math.round(num * 100) / 100;

        const expToNextLevel =
          hypixelReq.data.player.networkExp < 10000
            ? 10000
            : (2500 * Math.floor(level)) + 5000;

        const lastLevel = Math.floor(level) - 1;
        const levelExpFloor = 1250 * lastLevel ** 2 + 8750 * lastLevel;

        const levelProgress =
          Math.round(
            ((hypixelReq.data.player.networkExp - levelExpFloor) / expToNextLevel) * 100 * 100
          ) / 100;

        return {
          status: 200,
          body: {
            ...hypixelReq.data.player,
            level,
            expToNextLevel,
            levelExpFloor,
            levelProgress,
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
