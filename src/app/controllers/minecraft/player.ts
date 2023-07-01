import {
  cacheData,
  checkCacheByPlayername,
  checkCacheByUuid,
} from "../../../database/providers/minecraft";
import { parseWhole } from "../../../services/number";
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

      const cache = await checkCacheByPlayername(player, "mojang");
      if (cache.data) {
        cache.data.views = parseWhole(cache.data.views) + 1;
        cache.data.save();
      }
      if (!cache.refresh) {
        return {
          status: 200,
          body: {
            uuid: cache.data.uuid,
            username: cache.data.username,
            skin: cache.data.skin,
            cape: cache.data.cape,
            views: cache.data.views,
          },
        };
      }

      const uuidReq = await fetch(
        "https://api.mojang.com/users/profiles/minecraft/" + player
      ).catch((e) => {});
      if (!uuidReq) {
        return {
          status: 400,
          body: {
            error: "Invalid Mojang API Response",
          },
        };
      }
      const uuidData = await uuidReq.json();
      const skinReq = await fetch(
        "https://sessionserver.mojang.com/session/minecraft/profile/" +
          uuidData.id
      ).catch((e) => {});
      if (!skinReq) {
        return {
          status: 400,
          body: {
            error: "Invalid Mojang API Response",
          },
        };
      }
      const skinData = await skinReq.json();

      const parseData = (
        uuid: any,
        skin: any
      ): {
        uuid: string;
        username: string;
        skin: { url: string; id: string };
        cape: { url: string; id: string };
      } => {
        if (typeof uuid !== "object" || typeof skin !== "object")
          throw new Error("Invalid Mojang API Response");

        const decodedTextures = JSON.parse(
          Buffer.from(skin.properties[0].value, "base64").toString("ascii")
        );

        return {
          uuid: uuid.id,
          username: uuid.name,
          skin: {
            url:
              "https://api.bradn.dev/api/v1/minecraft/texture/" +
              (decodedTextures.textures.SKIN?.url
                ? decodedTextures.textures.SKIN.url.split("/texture/")[1]
                : ""),
            id: decodedTextures.textures.SKIN?.url
              ? decodedTextures.textures.SKIN.url.split("/texture/")[1]
              : "",
          },
          cape: {
            url:
              "https://api.bradn.dev/api/v1/minecraft/texture/" +
              (decodedTextures.textures.CAPE?.url
                ? decodedTextures.textures.CAPE.url.split("/texture/")[1]
                : ""),
            id: decodedTextures.textures.CAPE?.url
              ? decodedTextures.textures.CAPE.url.split("/texture/")[1]
              : "",
          },
        };
      };

      try {
        const parsed = parseData(uuidData, skinData);

        const data = await cacheData(parsed, "mojang");

        return {
          status: 200,
          body: {...parsed, views: data.views ?? 0},
        };
      } catch (e) {
        if (e instanceof Error) {
          return {
            status: 400,
            body: {
              error: e.message,
            },
          };
        }
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
