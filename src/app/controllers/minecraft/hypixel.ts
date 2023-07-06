import { Route } from "../../interfaces/route";
import { Minecraft } from "../../../types/minecraft";
import { Document, Types } from "mongoose";
import { getHypixelPlayer } from "../../providers/fetchHypixel";

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

      const hypixelPlayer = await getHypixelPlayer(uuid);
      if (typeof hypixelPlayer === 'string') return {
        status: 401,
        body: {
          error: hypixelPlayer,
        }
      }

      return {
        status: 200,
        body: hypixelPlayer,
      }
    },
  ],
};

export const checkSessionChange = (
  data: Partial<Omit<Minecraft, "cacheUntil">>,
  cache: Document<unknown, {}, Minecraft> &
    Omit<
      Minecraft & {
        _id: Types.ObjectId;
      },
      never
    >
) => {};
