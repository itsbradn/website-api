import { MinecraftModel } from "../../../database/schemas/minecraft";
import { parseWhole } from "../../../services/number";
import { Route } from "../../interfaces/route";

export const getLandingRoute: Route = {
  path: "/landing",
  method: "get",
  actions: [
    async (ctx) => {
      let creatorUser = await MinecraftModel.findById(
        "648a8226d063bebe329600f6"
      );
      if (!creatorUser) {
        console.log("No creator???");
        return {
          status: 400,
          body: {
            error: "Internal Server Error",
          },
        };
      }

      const creator = {
        username: creatorUser.username,
        uuid: creatorUser.uuid,
        skin: creatorUser.skin,
        cape: creatorUser.cape,
      };

      const users = await MinecraftModel.find();

      let mostViewedUser = users.sort((a, b) => {
        return parseWhole(b.views) - parseWhole(a.views);
      })[0];

      const mostViewed = {
        username: mostViewedUser.username,
        uuid: mostViewedUser.uuid,
        skin: mostViewedUser.skin,
        cape: mostViewedUser.cape,
        views: mostViewedUser.views ?? 0,
      };
      let recentlyUpdatedUser = users.sort((a, b) => {
        return (
          (b.mojangCacheUntil?.getTime() ?? 0) -
          (a.mojangCacheUntil?.getTime() ?? 0)
        );
      })[0];
      const recentlyUpdated = {
        username: recentlyUpdatedUser.username,
        uuid: recentlyUpdatedUser.uuid,
        skin: recentlyUpdatedUser.skin,
        cape: recentlyUpdatedUser.cape,
      };
      let highestKDUser = users.sort((a, b) => {
        return (
          parseWhole(b.games.bedwars?.finalKillDeathRatio) -
          parseWhole(a.games.bedwars?.finalKillDeathRatio)
        );
      })[0];
      const highestKD = {
        username: highestKDUser.username,
        uuid: highestKDUser.uuid,
        skin: highestKDUser.skin,
        cape: highestKDUser.cape,
      };

      let highestKarmaUser = users.sort((a, b) => {
        return parseWhole(b.karma) - parseWhole(a.karma);
      })[0];

      const highestKarma = {
        username: highestKarmaUser.username,
        uuid: highestKarmaUser.uuid,
        skin: highestKarmaUser.skin,
        cape: highestKarmaUser.cape,
      };

      let highestLevelUser = users.sort((a, b) => {
        return parseWhole(b.level) - parseWhole(a.level);
      })[0];

      const highestLevel = {
        username: highestLevelUser.username,
        uuid: highestLevelUser.uuid,
        skin: highestLevelUser.skin,
        cape: highestLevelUser.cape,
      };

      return {
        status: 200,
        body: {
          creator,
          mostViewed,
          recentlyUpdated,
          highestKD,
          highestKarma,
          highestLevel,
        },
      };
    },
  ],
};
