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
import { formatBedwarsStats } from "../../../services/hypixel/bedwars";
import { Minecraft } from "../../../types/minecraft";
import { Document, Types } from "mongoose";

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
            uuid: cache.uuid,
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
            karma: cache.karma,
            experience: cache.experience,
            expToNextLevel: cache.expToNextLevel,
            levelExpFloor: cache.levelExpFloor,
            levelProgress: cache.levelProgress,
            games: cache.games,
          },
        };
      }

      try {
        const data = await fetchHypixelData(uuid);

        const hypixelReq = data[0];
        const hypixelStatus = data[1];

        if (hypixelReq.data.success !== true) {
          return {
            status: 401,
            body: {
              error: hypixelReq.data.cause,
            },
          };
        }

        let final = {
          uuid,
          newPackageRank: hypixelReq.data.player.newPackageRank,
          monthlyPackageRank: hypixelReq.data.player.monthlyPackageRank,
          online: false,
          currentlyPlaying: null,
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
          karma: hypixelReq.data.player.karma,
          experience: hypixelReq.data.player.networkExp,
          ...calculateLevelData(hypixelReq.data.player.networkExp),
          games: {
            ...formatTntGamesStats(hypixelReq.data.player),
            ...formatBedwarsStats(hypixelReq.data.player),
          },
        };

        if (hypixelStatus.data.success === true) {
          final.online =
            hypixelStatus.data.session.online === true ? true : false;
          final.currentlyPlaying = hypixelStatus.data.session.gameType ?? null;
        }

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

export const fetchHypixelData = (uuid: string) => {
  const opts = {
    headers: {
      "API-Key": process.env.HYPIXEL_KEY!,
    },
  };

  const player = axios.get("https://api.hypixel.net/player?uuid=" + uuid, opts);
  const status = axios.get("https://api.hypixel.net/status?uuid=" + uuid, opts);

  return Promise.all([player, status]);
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
