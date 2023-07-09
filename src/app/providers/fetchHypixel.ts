import axios, { AxiosError } from "axios";
import {
  checkCacheByUuid,
  getCacheDoc,
} from "../../database/providers/minecraft";
import { calculateLevelData } from "../../services/hypixel/level";
import { formatTntGamesStats } from "../../services/hypixel/tntgames";
import { formatBedwarsStats } from "../../services/hypixel/bedwars";
import { formatBuildBattleStats } from "../../services/hypixel/buildbattle";
import { formatMurderMysteryStats } from "../../services/hypixel/murdermystery";
import { getMojangPlayerByUUID } from "./fetchMojang";

export const getHypixelPlayer = async (uuid: string) => {
  const cache = await checkCacheByUuid(uuid, "hypixel");
  let data = cache.data;
  if (cache.refresh || data === null) {
    const fetchData = await fetchHypixelData(uuid);
    const hypixelReq = fetchData[0];
    const hypixelStatus = fetchData[1];

    if (hypixelReq.data.success !== true) return hypixelReq.data.cause;
    let doc = cache.data === null ? await getCacheDoc(uuid) : cache.data;

    if (hypixelStatus.data.success === true) {
      doc.set(
        "online",
        hypixelStatus.data.session.online === true ? true : false
      );
      doc.set("currentlyPlaying", hypixelStatus.data.session.gameType ?? null);
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

    data = doc;
  }

  if (!data.username) {
    const mojang = await getMojangPlayerByUUID(data.uuid);
    if (mojang) {
      data.set(mojang);
    }
  }

  if (data.isModified()) await data.save();

  return {
    uuid: data.uuid,
    username: data.username,
    online: data.online,
    badges: {
      friend: data.badges.friend,
    },
    currentlyPlaying: data.currentlyPlaying,
    newPackageRank: data.newPackageRank,
    monthlyPackageRank: data.monthlyPackageRank,
    rankPlusColor: data.rankPlusColor,
    monthlyRankColor: data.monthlyRankColor,
    rank: data.rank,
    prefix: data.prefix,
    firstLogin: data.firstLogin,
    lastLogin: data.lastLogin,
    achievementPoints: data.achievementPoints,
    totalRewards: data.totalRewards,
    totalDailyRewards: data.totalDailyRewards,
    rewardStreak: data.rewardStreak,
    rewardScore: data.rewardScore,
    level: data.level,
    karma: data.karma,
    experience: data.experience,
    expToNextLevel: data.expToNextLevel,
    levelExpFloor: data.levelExpFloor,
    levelProgress: data.levelProgress,
    games: data.games,
  };
};

export const fetchHypixelData = (uuid: string) => {
  const player = fetchHypixelURL("https://api.hypixel.net/player?uuid=" + uuid);
  const status = fetchHypixelURL("https://api.hypixel.net/status?uuid=" + uuid);

  return Promise.all([player, status]);
};

export const fetchHypixelURL = async (url: string): Promise<any> => {
  const opts = {
    headers: {
      "API-Key": process.env.HYPIXEL_KEY!,
    },
  };
  try {
    return await axios.get(url, opts);
  } catch (e) {
    return (e as AxiosError).response;
  }
};

let hypixelLb: any = undefined;
let hypixelLbRefreshAt = Date.now();

export const getHypixelLeaderboards = async (): Promise<any> => {
  if (hypixelLbRefreshAt < Date.now()) {
    let lbData = await fetchHypixelURL("https://api.hypixel.net/leaderboards");
    if (typeof lbData === "string") {
      return lbData;
    }

    hypixelLb = lbData;

    hypixelLbRefreshAt = Date.now() + 1800000;
    return hypixelLb;
  }

  return hypixelLb;
};
