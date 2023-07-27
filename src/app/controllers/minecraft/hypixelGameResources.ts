import { Route } from "../../interfaces/route";
import axios from "axios";
let data: any = undefined;

export const getHypixelGamesRoute: Route = {
  path: "/resources/hypixel/games",
  method: "get",
  actions: [
    async (ctx) => {

      if (data !== undefined) {
        return {
          status: 200,
          body: data,
        }
      } 

      const opts = {
        headers: {
          "API-Key": process.env.HYPIXEL_KEY!,
        },
      };
      try {
        const reqData = await axios.get("https://api.hypixel.net/resources/games", opts);
        data = reqData.data;
        return {
          status: 200,
          body: data,
        }
      } catch (e) {
        return {
          status: 401,
          body: "Something went wrong",
        }
      }
    },
  ],
};
