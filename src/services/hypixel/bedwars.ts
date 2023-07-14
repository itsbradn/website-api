import { parseWhole, parseWinLoss } from "../number";

export interface BedwarsStats {
  gamesPlayed: number;
  dreamGamesPlayed: number;
  overallGamesPlayed: number;
  experience: number;
  level: number;
  experienceGameRatio: number;
  experienceWinRatio: number;
  lootChests: number;
  lootChestTypes: Record<string, number>;
  coins: number;
  winstreak: number;
  wins: number;
  losses: number;
  winLossRatio: number;
  kills: number;
  deaths: number;
  killDeathRatio: number;
  killWinRatio: number;
  killGameRatio: number;
  finalKills: number;
  finalDeaths: number;
  finalKillDeathRatio: number;
  finalKillWinRatio: number;
  finalKillGameRatio: number;
  bedsBroken: number;
  bedsLost: number;
  bedsBrokenBedsLostRatio: number;
  bedsBrokenGameRatio: number;
  bedsBrokenWinRatio: number;
  voidFinalKills: number;
  voidFinalDeaths: number;
  voidFinalKillDeathRatio: number;
  meleeFinalKills: number;
  meleeFinalDeaths: number;
  meleeFinalKillDeathRatio: number;
  magicFinalKills: number;
  magicFinalDeaths: number;
  magicFinalKillDeathRatio: number;
  fallFinalKills: number;
  fallFinalDeaths: number;
  fallFinalKillDeathRatio: number;
  voidKills: number;
  voidDeaths: number;
  voidKillDeathRatio: number;
  meleeKills: number;
  meleeDeaths: number;
  meleeKillDeathRatio: number;
  magicKills: number;
  magicDeaths: number;
  magicKillDeathRatio: number;
  fallKills: number;
  fallDeaths: number;
  fallKillDeathRatio: number;
  resources: {
    iron: number;
    gold: number;
    diamonds: number;
    emeralds: number;
  };
  itemsPurchased: number;
  upgradesPurchased: number;
  modes: bedwarsMode;
}

export const formatBedwarsStats = (
  hypixel: any
): { bedwars?: BedwarsStats } => {
  if (!hypixel || !hypixel["stats"] || !hypixel["stats"]["Bedwars"]) return {};
  const bedwars = hypixel["stats"]["Bedwars"];

  return {
    bedwars: {
      gamesPlayed: parseWhole(bedwars["games_played_bedwars"]),
      dreamGamesPlayed:
        parseWhole(bedwars["games_played_bedwars_1"]) -
        parseWhole(bedwars["games_played_bedwars"]),
      overallGamesPlayed: parseWhole(bedwars["games_played_bedwars_1"]),
      experience: parseWhole(bedwars["Experience"]),
      level: getLevelForExp(parseWhole(bedwars["Experience"])),
      experienceGameRatio: parseWinLoss(
        bedwars["Experience"],
        bedwars["games_played_bedwars"]
      ),
      experienceWinRatio: parseWinLoss(
        bedwars["Experience"],
        bedwars["wins_bedwars"]
      ),
      ...calculateBedwarsLootChests(bedwars),
      coins: parseWhole(bedwars["coins"]),
      winstreak: parseWhole(bedwars["winstreak"]),
      wins: parseWhole(bedwars["wins_bedwars"]),
      losses: parseWhole(bedwars["losses_bedwars"]),
      winLossRatio: parseWinLoss(
        bedwars["wins_bedwars"],
        bedwars["losses_bedwars"]
      ),
      kills: parseWhole(bedwars["kills_bedwars"]),
      deaths: parseWhole(bedwars["deaths_bedwars"]),
      killDeathRatio: parseWinLoss(
        bedwars["kills_bedwars"],
        bedwars["deaths_bedwars"]
      ),
      killWinRatio: parseWinLoss(
        bedwars["kills_bedwars"],
        bedwars["wins_bedwars"]
      ),
      killGameRatio: parseWinLoss(
        bedwars["kills_bedwars"],
        bedwars["games_played_bedwars"]
      ),
      finalKills: parseWhole(bedwars["final_kills_bedwars"]),
      finalDeaths: parseWhole(bedwars["final_deaths_bedwars"]),
      finalKillDeathRatio: parseWinLoss(
        bedwars["final_kills_bedwars"],
        bedwars["final_deaths_bedwars"]
      ),
      finalKillWinRatio: parseWinLoss(
        bedwars["final_kills_bedwars"],
        bedwars["wins_bedwars"]
      ),
      finalKillGameRatio: parseWinLoss(
        bedwars["final_kills_bedwars"],
        bedwars["games_played_bedwars"]
      ),
      bedsBroken: parseWhole(bedwars["beds_broken_bedwars"]),
      bedsLost: parseWhole(bedwars["beds_lost_bedwars"]),
      bedsBrokenBedsLostRatio: parseWinLoss(
        bedwars["beds_broken_bedwars"],
        bedwars["beds_lost_bedwars"]
      ),
      bedsBrokenGameRatio: parseWinLoss(
        bedwars["beds_broken_bedwars"],
        bedwars["games_played_bedwars"]
      ),
      bedsBrokenWinRatio: parseWinLoss(
        bedwars["beds_broken_bedwars"],
        bedwars["wins_bedwars"]
      ),
      voidFinalKills: parseWhole(bedwars["void_final_kills_bedwars"]),
      voidFinalDeaths: parseWhole(bedwars["void_final_deaths_bedwars"]),
      voidFinalKillDeathRatio: parseWinLoss(
        bedwars["void_final_kills_bedwars"],
        bedwars["void_final_deaths_bedwars"]
      ),
      meleeFinalKills: parseWhole(bedwars["entity_attack_final_kills_bedwars"]),
      meleeFinalDeaths: parseWhole(
        bedwars["entity_attack_final_deaths_bedwars"]
      ),
      meleeFinalKillDeathRatio: parseWinLoss(
        bedwars["entity_attack_final_kills_bedwars"],
        bedwars["entity_attack_final_deaths_bedwars"]
      ),
      magicFinalKills: parseWhole(bedwars["magic_final_kills_bedwars"]),
      magicFinalDeaths: parseWhole(bedwars["magic_final_deaths_bedwars"]),
      magicFinalKillDeathRatio: parseWinLoss(
        bedwars["magic_final_kills_bedwars"],
        bedwars["magic_final_deaths_bedwars"]
      ),
      fallFinalKills: parseWhole(bedwars["fall_final_kills_bedwars"]),
      fallFinalDeaths: parseWhole(bedwars["fall_final_deaths_bedwars"]),
      fallFinalKillDeathRatio: parseWinLoss(
        bedwars["fall_final_kills_bedwars"],
        bedwars["fall_final_deaths_bedwars"]
      ),
      voidKills: parseWhole(bedwars["void_kills_bedwars"]),
      voidDeaths: parseWhole(bedwars["void_deaths_bedwars"]),
      voidKillDeathRatio: parseWinLoss(
        bedwars["void_kills_bedwars"],
        bedwars["void_deaths_bedwars"]
      ),
      meleeKills: parseWhole(bedwars["entity_attack_kills_bedwars"]),
      meleeDeaths: parseWhole(bedwars["entity_attack_deaths_bedwars"]),
      meleeKillDeathRatio: parseWinLoss(
        bedwars["entity_attack_kills_bedwars"],
        bedwars["entity_attack_deaths_bedwars"]
      ),
      magicKills: parseWhole(bedwars["magic_kills_bedwars"]),
      magicDeaths: parseWhole(bedwars["magic_deaths_bedwars"]),
      magicKillDeathRatio: parseWinLoss(
        bedwars["magic_kills_bedwars"],
        bedwars["magic_deaths_bedwars"]
      ),
      fallKills: parseWhole(bedwars["fall_kills_bedwars"]),
      fallDeaths: parseWhole(bedwars["fall_deaths_bedwars"]),
      fallKillDeathRatio: parseWinLoss(
        bedwars["fall_kills_bedwars"],
        bedwars["fall_deaths_bedwars"]
      ),
      resources: {
        iron: parseWhole(bedwars["iron_resources_collected_bedwars"]),
        gold: parseWhole(bedwars["gold_resources_collected_bedwars"]),
        diamonds: parseWhole(bedwars["diamond_resources_collected_bedwars"]),
        emeralds: parseWhole(bedwars["emerald_resources_collected_bedwars"]),
      },
      itemsPurchased: parseWhole(bedwars["items_purchased_bedwars"]),
      upgradesPurchased: parseWhole(
        bedwars["permanent _items_purchased_bedwars"]
      ),
      modes: calculateModeStats(bedwars),
    },
  };
};

let bedwarsLootChestKeys: Array<string> = [
  "bedwars_boxes",
  "bedwars_lunar_boxes",
  "bedwars_halloween_boxes",
  "bedwars_christmas_boxes",
  "bedwars_easter_boxes",
];

export const calculateBedwarsLootChests = (bedwars: any) => {
  if (!bedwars) {
    let emptyLoots: Record<string, number> = {};
    bedwarsLootChestKeys.forEach(
      (v) => (emptyLoots[parseBedwarsLootChestName(v)] = 0)
    );
    return { lootChests: 0, lootChestTypes: emptyLoots };
  }

  let chestTypes: Record<string, number> = {};
  let total = 0;

  bedwarsLootChestKeys.forEach((v) => {
    chestTypes[parseBedwarsLootChestName(v)] = parseWhole(bedwars[v]);
    total = Math.round(total + parseWhole(bedwars[v]));
  });

  return {
    lootChests: total,
    lootChestTypes: chestTypes,
  };
};

export const parseBedwarsLootChestName = (name: any) => {
  if (typeof name !== "string") return "invalid";

  return name === "bedwars_boxes"
    ? "lootChest"
    : name.replace("bedwars_", "").replace("_boxes", "Chests");
};

const modeKeyPrefixes = [
  "eight_one_",
  "eight_two_",
  "four_three_",
  "four_four_",
  "two_four_",
] as const;

type bedwarsMode = Record<string, modeStats>;

interface modeStats {
  gamesPlayed: number;
  winstreak: number;
  wins: number;
  losses: number;
  winLossRatio: number;
  kills: number;
  deaths: number;
  killDeathRatio: number;
  killWinRatio: number;
  killGameRatio: number;
  finalKills: number;
  finalDeaths: number;
  finalKillDeathRatio: number;
  finalKillWinRatio: number;
  finalKillGameRatio: number;
  bedsBroken: number;
  bedsLost: number;
  bedsBrokenBedsLostRatio: number;
  bedsBrokenGameRatio: number;
  bedsBrokenWinRatio: number;
  voidFinalKills: number;
  voidFinalDeaths: number;
  voidFinalKillDeathRatio: number;
  meleeFinalKills: number;
  meleeFinalDeaths: number;
  meleeFinalKillDeathRatio: number;
  magicFinalKills: number;
  magicFinalDeaths: number;
  magicFinalKillDeathRatio: number;
  fallFinalKills: number;
  fallFinalDeaths: number;
  fallFinalKillDeathRatio: number;
  voidKills: number;
  voidDeaths: number;
  voidKillDeathRatio: number;
  meleeKills: number;
  meleeDeaths: number;
  meleeKillDeathRatio: number;
  magicKills: number;
  magicDeaths: number;
  magicKillDeathRatio: number;
  fallKills: number;
  fallDeaths: number;
  fallKillDeathRatio: number;
  resources: {
    iron: number;
    gold: number;
    diamonds: number;
    emeralds: number;
  };
  itemsPurchased: number;
  upgradesPurchased: number;
}

export const calculateModeStats = (bedwars: any) => {
  let final: bedwarsMode = {};
  for (const mode of modeKeyPrefixes) {
    final[convertModePrefixToTitle(mode)] = {
      gamesPlayed: parseWhole(bedwars[mode + "games_played_bedwars"]),
      winstreak: parseWhole(bedwars[mode + "winstreak"]),
      wins: parseWhole(bedwars[mode + "wins_bedwars"]),
      losses: parseWhole(bedwars[mode + "losses_bedwars"]),
      winLossRatio: parseWinLoss(
        bedwars[mode + "wins_bedwars"],
        bedwars[mode + "losses_bedwars"]
      ),
      kills: parseWhole(bedwars[mode + "kills_bedwars"]),
      deaths: parseWhole(bedwars[mode + "deaths_bedwars"]),
      killDeathRatio: parseWinLoss(
        bedwars[mode + "kills_bedwars"],
        bedwars[mode + "deaths_bedwars"]
      ),
      killWinRatio: parseWinLoss(
        bedwars[mode + "kills_bedwars"],
        bedwars[mode + "wins_bedwars"]
      ),
      killGameRatio: parseWinLoss(
        bedwars[mode + "kills_bedwars"],
        bedwars[mode + "games_played_bedwars"]
      ),
      finalKills: parseWhole(bedwars[mode + "final_kills_bedwars"]),
      finalDeaths: parseWhole(bedwars[mode + "final_deaths_bedwars"]),
      finalKillDeathRatio: parseWinLoss(
        bedwars[mode + "final_kills_bedwars"],
        bedwars[mode + "final_deaths_bedwars"]
      ),
      finalKillWinRatio: parseWinLoss(
        bedwars[mode + "final_kills_bedwars"],
        bedwars[mode + "wins_bedwars"]
      ),
      finalKillGameRatio: parseWinLoss(
        bedwars[mode + "final_kills_bedwars"],
        bedwars[mode + "games_played_bedwars"]
      ),
      bedsBroken: parseWhole(bedwars[mode + "beds_broken_bedwars"]),
      bedsLost: parseWhole(bedwars[mode + "beds_lost_bedwars"]),
      bedsBrokenBedsLostRatio: parseWinLoss(
        bedwars[mode + "beds_broken_bedwars"],
        bedwars[mode + "beds_lost_bedwars"]
      ),
      bedsBrokenGameRatio: parseWinLoss(
        bedwars[mode + "beds_broken_bedwars"],
        bedwars[mode + "games_played_bedwars"]
      ),
      bedsBrokenWinRatio: parseWinLoss(
        bedwars[mode + "beds_broken_bedwars"],
        bedwars[mode + "wins_bedwars"]
      ),
      voidFinalKills: parseWhole(bedwars[mode + "void_final_kills_bedwars"]),
      voidFinalDeaths: parseWhole(bedwars[mode + "void_final_deaths_bedwars"]),
      voidFinalKillDeathRatio: parseWinLoss(
        bedwars[mode + "void_final_kills_bedwars"],
        bedwars[mode + "void_final_deaths_bedwars"]
      ),
      meleeFinalKills: parseWhole(
        bedwars[mode + "entity_attack_final_kills_bedwars"]
      ),
      meleeFinalDeaths: parseWhole(
        bedwars[mode + "entity_attack_final_deaths_bedwars"]
      ),
      meleeFinalKillDeathRatio: parseWinLoss(
        bedwars[mode + "entity_attack_final_kills_bedwars"],
        bedwars[mode + "entity_attack_final_deaths_bedwars"]
      ),
      magicFinalKills: parseWhole(bedwars[mode + "magic_final_kills_bedwars"]),
      magicFinalDeaths: parseWhole(
        bedwars[mode + "magic_final_deaths_bedwars"]
      ),
      magicFinalKillDeathRatio: parseWinLoss(
        bedwars[mode + "magic_final_kills_bedwars"],
        bedwars[mode + "magic_final_deaths_bedwars"]
      ),
      fallFinalKills: parseWhole(bedwars[mode + "fall_final_kills_bedwars"]),
      fallFinalDeaths: parseWhole(bedwars[mode + "fall_final_deaths_bedwars"]),
      fallFinalKillDeathRatio: parseWinLoss(
        bedwars[mode + "fall_final_kills_bedwars"],
        bedwars[mode + "fall_final_deaths_bedwars"]
      ),
      voidKills: parseWhole(bedwars[mode + "void_kills_bedwars"]),
      voidDeaths: parseWhole(bedwars[mode + "void_deaths_bedwars"]),
      voidKillDeathRatio: parseWinLoss(
        bedwars[mode + "void_kills_bedwars"],
        bedwars[mode + "void_deaths_bedwars"]
      ),
      meleeKills: parseWhole(bedwars[mode + "entity_attack_kills_bedwars"]),
      meleeDeaths: parseWhole(bedwars[mode + "entity_attack_deaths_bedwars"]),
      meleeKillDeathRatio: parseWinLoss(
        bedwars[mode + "entity_attack_kills_bedwars"],
        bedwars[mode + "entity_attack_deaths_bedwars"]
      ),
      magicKills: parseWhole(bedwars[mode + "magic_kills_bedwars"]),
      magicDeaths: parseWhole(bedwars[mode + "magic_deaths_bedwars"]),
      magicKillDeathRatio: parseWinLoss(
        bedwars[mode + "magic_kills_bedwars"],
        bedwars[mode + "magic_deaths_bedwars"]
      ),
      fallKills: parseWhole(bedwars[mode + "fall_kills_bedwars"]),
      fallDeaths: parseWhole(bedwars[mode + "fall_deaths_bedwars"]),
      fallKillDeathRatio: parseWinLoss(
        bedwars[mode + "fall_kills_bedwars"],
        bedwars[mode + "fall_deaths_bedwars"]
      ),
      resources: {
        iron: parseWhole(bedwars[mode + "iron_resources_collected_bedwars"]),
        gold: parseWhole(bedwars[mode + "gold_resources_collected_bedwars"]),
        diamonds: parseWhole(
          bedwars[mode + "diamond_resources_collected_bedwars"]
        ),
        emeralds: parseWhole(
          bedwars[mode + "emerald_resources_collected_bedwars"]
        ),
      },
      itemsPurchased: parseWhole(bedwars[mode + "items_purchased_bedwars"]),
      upgradesPurchased: parseWhole(
        bedwars[mode + "permanent _items_purchased_bedwars"]
      ),
    };
  }

  return final;
};

export const convertModePrefixToTitle = (
  prefix: (typeof modeKeyPrefixes)[number]
) => {
  if (prefix === "eight_one_") return "solos";
  if (prefix === "eight_two_") return "doubles";
  if (prefix === "four_four_") return "4v4v4v4";
  if (prefix === "four_three_") return "3v3v3v3";
  return "4v4";
};

const EASY_LEVELS = 4;
const EASY_LEVELS_XP = 7000;
const XP_PER_PRESTIGE = 96 * 5000 + EASY_LEVELS_XP;
const LEVELS_PER_PRESTIGE = 100;
const HIGHEST_PRESTIGE = 10;

/**
 * The following code is provided by KAD7 on the hypixel forums :)
 */
function getExpForLevel(level: number) {
  if (level == 0) return 0;

  var respectedLevel = getLevelRespectingPrestige(level);
  if (respectedLevel > EASY_LEVELS) {
    return 5000;
  }

  switch (respectedLevel) {
    case 1:
      return 500;
    case 2:
      return 1000;
    case 3:
      return 2000;
    case 4:
      return 3500;
  }
  return 5000;
}

/**
 * The following code is provided by KAD7 on the hypixel forums :)
 */
function getLevelRespectingPrestige(level: number) {
  if (level > HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE) {
    return level - HIGHEST_PRESTIGE * LEVELS_PER_PRESTIGE;
  } else {
    return level % LEVELS_PER_PRESTIGE;
  }
}

/**
 * The following code is provided by KAD7 on the hypixel forums :)
 */
function getLevelForExp(exp: number) {
  var prestiges = Math.floor(exp / XP_PER_PRESTIGE);
  var level = prestiges * LEVELS_PER_PRESTIGE;
  var expWithoutPrestiges = exp - prestiges * XP_PER_PRESTIGE;

  for (let i = 1; i <= EASY_LEVELS; ++i) {
    var expForEasyLevel = getExpForLevel(i);
    if (expWithoutPrestiges < expForEasyLevel) {
      break;
    }
    level++;
    expWithoutPrestiges -= expForEasyLevel;
  }
  //returns players bedwars level, remove the Math.floor if you want the exact bedwars level returned
  return level + expWithoutPrestiges / 5000;
}
