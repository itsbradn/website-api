import axios from "axios";
import { Route } from "../../interfaces/route";
import {
  calculateLevelData,
  calculateLevelFromExp,
} from "../../../services/hypixel/level";
import { formatTntGamesStats } from "../../../services/hypixel/tntgames";
import {
  cacheData,
  checkCacheByUuid,
} from "../../../database/providers/minecraft";

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
      const cache = await checkCacheByUuid(uuid, "hypixel");
      if (cache) {
        return {
          status: 200,
          body: {
            newPackageRank: cache.newPackageRank,
            monthlyPackageRank: cache.monthlyPackageRank,
            rankPlusColor: cache.rankPlusColor,
            monthlyRankColor: cache.monthlyRankColor,
            rank: cache.rank,
            prefix: cache.prefix,
            firstLogin: cache.firstLogin,
            lastLogin: cache.lastLogin,
            achievementPoints: cache.achievementPoints,
            totalRewards: cache.totalRewards,
            totalDailyRewards: cache.totalDailyRewards,
            rewardStreak: cache.rewardStreak,
            rewardScore: cache.rewardScore,
            level: cache.level,
            expToNextLevel: cache.expToNextLevel,
            levelExpFloor: cache.levelExpFloor,
            levelProgress: cache.levelProgress,
            games: cache.games,
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

        const final = {
          uuid,
          newPackageRank: hypixelReq.data.player.newPackageRank,
          monthlyPackageRank: hypixelReq.data.player.monthlyPackageRank,
          rankPlusColor: hypixelReq.data.player.rankPlusColor,
          monthlyRankColor: hypixelReq.data.player.monthlyRankColor,
          rank: hypixelReq.data.player.rank,
          prefix: hypixelReq.data.player.prefix,
          firstLogin: hypixelReq.data.player.firstLogin,
          lastLogin: hypixelReq.data.player.lastLogin,
          achievementPoints: hypixelReq.data.player.achievementPoints,
          totalRewards: hypixelReq.data.player.totalRewards,
          totalDailyRewards: hypixelReq.data.player.totalDailyRewards,
          rewardStreak: hypixelReq.data.player.rewardStreak,
          rewardScore: hypixelReq.data.player.rewardScore,
          ...calculateLevelData(hypixelReq.data.player.networkExp),
          games: {
            ...formatTntGamesStats(hypixelReq.data.player),
          },
        };

        cacheData(final, "hypixel");

        return {
          status: 200,
          body: final,
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
