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
  getCacheDoc,
} from "../../../database/providers/minecraft";
import { formatBedwarsStats } from "../../../services/hypixel/bedwars";
import { Minecraft } from "../../../types/minecraft";
import { Document, Types } from "mongoose";
import { formatBuildBattleStats } from "../../../services/hypixel/buildbattle";
import { formatMurderMysteryStats } from "../../../services/hypixel/murdermystery";

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
      console.log(cache);
      if (!cache.refresh) {
        console.log("cached");
        return {
          status: 200,
          body: {
            uuid: cache.data.uuid,
            online: cache.data.online,
            currentlyPlaying: cache.data.currentlyPlaying,
            newPackageRank: cache.data.newPackageRank,
            monthlyPackageRank: cache.data.monthlyPackageRank,
            rankPlusColor: cache.data.rankPlusColor,
            monthlyRankColor: cache.data.monthlyRankColor,
            rank: cache.data.rank,
            prefix: cache.data.prefix,
            firstLogin: cache.data.firstLogin,
            lastLogin: cache.data.lastLogin,
            achievementPoints: cache.data.achievementPoints,
            totalRewards: cache.data.totalRewards,
            totalDailyRewards: cache.data.totalDailyRewards,
            rewardStreak: cache.data.rewardStreak,
            rewardScore: cache.data.rewardScore,
            level: cache.data.level,
            karma: cache.data.karma,
            experience: cache.data.experience,
            expToNextLevel: cache.data.expToNextLevel,
            levelExpFloor: cache.data.levelExpFloor,
            levelProgress: cache.data.levelProgress,
            games: cache.data.games,
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
        let doc = cache.data === null ? await getCacheDoc(uuid) : cache.data;

        if (hypixelStatus.data.success === true) {
          doc.set(
            "online",
            hypixelStatus.data.session.online === true ? true : false
          );
          doc.set(
            "currentlyPlaying",
            hypixelStatus.data.session.gameType ?? null
          );
        }

        let finalData = {
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
          karma: hypixelReq.data.player.karma,
          experience: hypixelReq.data.player.networkExp,
          ...calculateLevelData(hypixelReq.data.player.networkExp),
          games: {
            ...formatTntGamesStats(hypixelReq.data.player),
            ...formatBedwarsStats(hypixelReq.data.player),
            ...formatBuildBattleStats(hypixelReq.data.player),
            ...formatMurderMysteryStats(hypixelReq.data.player),
          },
        };
        doc.set(finalData);
        doc.set("hypixelCacheUntil", new Date(Date.now() + 2 * 60 * 1000));

        doc.save();

        return {
          status: 200,
          body: {
            uuid: doc.uuid,
            online: doc.online,
            currentlyPlaying: doc.currentlyPlaying,
            newPackageRank: doc.newPackageRank,
            monthlyPackageRank: doc.monthlyPackageRank,
            rankPlusColor: doc.rankPlusColor,
            monthlyRankColor: doc.monthlyRankColor,
            rank: doc.rank,
            prefix: doc.prefix,
            firstLogin: doc.firstLogin,
            lastLogin: doc.lastLogin,
            achievementPoints: doc.achievementPoints,
            totalRewards: doc.totalRewards,
            totalDailyRewards: doc.totalDailyRewards,
            rewardStreak: doc.rewardStreak,
            rewardScore: doc.rewardScore,
            level: doc.level,
            karma: doc.karma,
            experience: doc.experience,
            expToNextLevel: doc.expToNextLevel,
            levelExpFloor: doc.levelExpFloor,
            levelProgress: doc.levelProgress,
            games: doc.games,
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
