import { BedwarsStats } from "../services/hypixel/bedwars";
import { BuildBattleStats } from "../services/hypixel/buildbattle";
import { MurderMysteryStats } from "../services/hypixel/murdermystery";
import { TNTGamesStats } from "../services/hypixel/tntgames";

export interface Minecraft {
  mojangCacheUntil: Date;
  hypixelCacheUntil: Date;
  uuid: string;
  username: string;
  skin: { url: string; id: string };
  cape: { url: string; id: string };
  online: boolean;
  currentlyPlaying: string | null;
  newPackageRank?: string; // ? because hypixel api is weird
  monthlyPackageRank?: string; // ? because hypixel api is weird
  rankPlusColor?: string; // ? because hypixel api is weird
  monthlyRankColor?: string; // ? because hypixel api is weird
  rank?: string; // ? because hypixel api is weird
  prefix?: string; // ? because hypixel api is weird
  firstLogin?: number; // ? because hypixel api is weird
  lastLogin?: number; // ? because hypixel api is weird
  achievementPoints?: number; // ? because hypixel api is weird
  totalRewards?: number; // ? because hypixel api is weird
  totalDailyRewards?: number; // ? because hypixel api is weird
  rewardStreak?: number; // ? because hypixel api is weird
  rewardScore?: number; // ? because hypixel api is weird
  views?: number;
  viewers: Array<string>;
  karma: number;
  experience: number;
  level: number;
  expToNextLevel: number;
  levelExpFloor: number;
  levelProgress: number;
  thumbnailBuffer?: Buffer;
  games: {
    tntGames?: TNTGamesStats;
    bedwars?: BedwarsStats;
    buildBattle?: BuildBattleStats;
    murderMystery?: MurderMysteryStats;
  };
}
