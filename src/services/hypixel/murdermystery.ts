import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { parseWhole, parseWinLoss } from "../number";

dayjs.extend(duration);

export interface MurderMysteryStats {
  coins: number;
  coinsPickedUp: number;
  wins: number;
  deaths: number;
  suicides: number;
  kills: number;
  winLossRatio: number;
  killDeathRatio: number;
  knifeKills: number;
  thrownKnifeKills: number;
  bowKills: number;
  trapKills: number;
  gamesPlayed: number;
  detectiveWins: number;
  murdererWins: number;
  heroWins: number;
  detectiveChance: number;
  murdererChance: number;
  maps: any;
  modes: {
    classic: {
      coinsPickedUp: number;
      wins: number;
      deaths: number;
      suicides: number;
      kills: number;
      winLossRatio: number;
      killDeathRatio: number;
      knifeKills: number;
      thrownKnifeKills: number;
      bowKills: number;
      trapKills: number;
      gamesPlayed: number;
      detectiveWins: number;
      murdererWins: number;
      heroWins: number;
    };
    doubleUp: {
      coinsPickedUp: number;
      wins: number;
      deaths: number;
      suicides: number;
      kills: number;
      winLossRatio: number;
      killDeathRatio: number;
      knifeKills: number;
      thrownKnifeKills: number;
      bowKills: number;
      trapKills: number;
      gamesPlayed: number;
      detectiveWins: number;
      murdererWins: number;
      heroWins: number;
    };
    infection: {
      coinsPickedUp: number;
      wins: number;
      deaths: number;
      kills: number;
      winLossRatio: number;
      killDeathRatio: number;
      bowKills: number;
      killsAsInfected: number;
      killsAsSurvivor: number;
      gamesPlayed: number;
      timesLast: number;
      survivorWins: number;
    };
    assassins: {
      coinsPickedUp: number;
      wins: number;
      deaths: number;
      kills: number;
      winLossRatio: number;
      killDeathRatio: number;
      knifeKills: number;
      thrownKnifeKills: number;
      bowKills: number;
      trapKills: number;
      gamesPlayed: number;
    };
  };
}

export const formatMurderMysteryStats = (
  hypixelRes: any
): { murderMystery?: MurderMysteryStats } => {
  if (
    !hypixelRes ||
    !hypixelRes["stats"] ||
    !hypixelRes["stats"]["MurderMystery"]
  )
    return {};

  const mmStats = hypixelRes["stats"]["MurderMystery"];

  return {
    murderMystery: {
      coins: parseWhole(mmStats["coins"]),
      coinsPickedUp: parseWhole(mmStats["coins_pickedup"]),
      wins: parseWhole(mmStats["wins"]),
      deaths: parseWhole(mmStats["deaths"]),
      suicides: parseWhole(mmStats["suicides"]),
      kills: parseWhole(mmStats["kills"]),
      winLossRatio: parseWinLoss(mmStats["wins"], mmStats["deaths"]),
      killDeathRatio: parseWinLoss(mmStats["kills"], mmStats["deaths"]),
      knifeKills: parseWhole(mmStats["knife_kills"]),
      thrownKnifeKills: parseWhole(mmStats["thrown_knife_kills"]),
      bowKills: parseWhole(mmStats["bow_kills"]),
      trapKills: parseWhole(mmStats["trap_kills"]),
      gamesPlayed: parseWhole(mmStats["games"]),
      detectiveWins: parseWhole(mmStats["detective_wins"]),
      murdererWins: parseWhole(mmStats["murderer_wins"]),
      heroWins: parseWhole(mmStats["was_hero"]),
      detectiveChance: parseWhole(mmStats["detective_chance"]),
      murdererChance: parseWhole(mmStats["murderer_chance"]),
      maps: calculateMapStats(mmStats),
      modes: {
        classic: formatClassicStats(mmStats),
        doubleUp: formatDoubleUpStats(mmStats),
        infection: formatInfectionStats(mmStats),
        assassins: formatAssassinsStats(mmStats),
      },
    },
  };
};

const MAP_KEYS = [
  "archives",
  "cruise_ship",
  "gold_rush",
  "hypixel_world",
  "library",
  "transport",
  "ancient_tomb",
  "aquarium",
  "archives_top_floor",
  "darkfall",
  "headquarters",
  "hollywood",
  "mountain",
  "san_peratico_v2",
  "skyway_pier",
  "snowyglobe",
  "spooky_mansion",
  "subway",
  "towerfall",
  "villa",
  "widow's_den",
] as const;

export const updateMapKey = (map: (typeof MAP_KEYS)[number]) => {
  if (map === "archives") return "archives";
  if (map === "cruise_ship") return "cruiseShip";
  if (map === "gold_rush") return "goldRush";
  if (map === "hypixel_world") return "hypixelWorld";
  if (map === "library") return "library";
  if (map === "transport") return "transport";
  if (map === "ancient_tomb") return "ancientTomb";
  if (map === "aquarium") return "aquarium";
  if (map === "archives_top_floor") return "archivesTopFloor";
  if (map === "darkfall") return "darkfall";
  if (map === "headquarters") return "headquarters";
  if (map === "hollywood") return "hollywood";
  if (map === "mountain") return "mountain";
  if (map === "san_peratico_v2") return "sanPeraticoV2";
  if (map === "skyway_pier") return "skywayPier";
  if (map === "snowyglobe") return "snowyglobe";
  if (map === "spooky_mansion") return "spookyMansion";
  if (map === "subway") return "subway";
  if (map === "towerfall") return "towerfall";
  if (map === "villa") return "villa";
  return "widowsDen";
};

export const calculateMapStats = (mmStats: any) => {
  let final: Record<string, any> = {};

  for (const key of MAP_KEYS) {
    final[updateMapKey(key)] = {
      wins: parseWhole(mmStats[formatStatKey("wins", key)]),
      deaths: parseWhole(mmStats[formatStatKey("deaths", key)]),
      suicides: parseWhole(mmStats[formatStatKey("suicides", key)]),
      kills: parseWhole(mmStats[formatStatKey("kills", key)]),
      winLossRatio: parseWinLoss(
        parseWhole(mmStats[formatStatKey("wins", key)]),
        parseWhole(mmStats[formatStatKey("deaths", key)])
      ),
      killDeathRatio: parseWinLoss(
        parseWhole(mmStats[formatStatKey("kills", key)]),
        parseWhole(mmStats[formatStatKey("deaths", key)])
      ),
      knifeKills: parseWhole(mmStats[formatStatKey("knife_kills", key)]),
      thrownKnifeKills: parseWhole(
        mmStats[formatStatKey("thrown_knife_kills", key)]
      ),
      bowKills: parseWhole(mmStats[formatStatKey("bow_kills", key)]),
      trapKills: parseWhole(mmStats[formatStatKey("trap_kills", key)]),
      gamesPlayed: parseWhole(mmStats[formatStatKey("games", key)]),
      detectiveWins: parseWhole(mmStats[formatStatKey("detective_wins", key)]),
      murdererWins: parseWhole(mmStats[formatStatKey("murderer_wins", key)]),
      heroWins: parseWhole(mmStats[formatStatKey("was_hero", key)]),
      modes: {
        classic: formatClassicStats(mmStats, key),
        doubleUp: formatDoubleUpStats(mmStats, key),
        infection: formatInfectionStats(mmStats, key),
        assassins: formatAssassinsStats(mmStats, key),
      },
    };
  }
  return final;
};

export const formatStatKey = (
  stat: string,
  map?: string,
  mode?: "ASSASSINS" | "CLASSIC" | "DOUBLE_UP" | "INFECTION"
) => {
  return `${stat}${map !== undefined ? "_" + map : ""}${
    mode !== undefined ? "_MURDER_" + mode : ""
  }`;
};

export const formatClassicStats = (mmStats: any, map?: string) => {
  return {
    coinsPickedUp: parseWhole(
      mmStats[formatStatKey("coins_pickedup", map ?? undefined, "CLASSIC")]
    ),
    wins: parseWhole(
      mmStats[formatStatKey("wins", map ?? undefined, "CLASSIC")]
    ),
    deaths: parseWhole(
      mmStats[formatStatKey("deaths", map ?? undefined, "CLASSIC")]
    ),
    suicides: parseWhole(
      mmStats[formatStatKey("suicides", map ?? undefined, "CLASSIC")]
    ),
    kills: parseWhole(
      mmStats[formatStatKey("kills", map ?? undefined, "CLASSIC")]
    ),
    winLossRatio: parseWinLoss(
      parseWhole(mmStats[formatStatKey("wins", map ?? undefined, "CLASSIC")]),
      parseWhole(mmStats[formatStatKey("deaths", map ?? undefined, "CLASSIC")])
    ),
    killDeathRatio: parseWinLoss(
      parseWhole(mmStats[formatStatKey("kills", map ?? undefined, "CLASSIC")]),
      parseWhole(mmStats[formatStatKey("deaths", map ?? undefined, "CLASSIC")])
    ),
    knifeKills: parseWhole(
      mmStats[formatStatKey("knife_kills", map ?? undefined, "CLASSIC")]
    ),
    thrownKnifeKills: parseWhole(
      mmStats[formatStatKey("thrown_knife_kills", map ?? undefined, "CLASSIC")]
    ),
    bowKills: parseWhole(
      mmStats[formatStatKey("bow_kills", map ?? undefined, "CLASSIC")]
    ),
    trapKills: parseWhole(
      mmStats[formatStatKey("trap_kills", map ?? undefined, "CLASSIC")]
    ),
    gamesPlayed: parseWhole(
      mmStats[formatStatKey("games", map ?? undefined, "CLASSIC")]
    ),
    detectiveWins: parseWhole(
      mmStats[formatStatKey("detective_wins", map ?? undefined, "CLASSIC")]
    ),
    murdererWins: parseWhole(
      mmStats[formatStatKey("murderer_wins", map ?? undefined, "CLASSIC")]
    ),
    heroWins: parseWhole(
      mmStats[formatStatKey("was_hero", map ?? undefined, "CLASSIC")]
    ),
  };
};

export const formatDoubleUpStats = (mmStats: any, map?: string) => {
  return {
    coinsPickedUp: parseWhole(
      mmStats[formatStatKey("coins_pickedup", map ?? undefined, "DOUBLE_UP")]
    ),
    wins: parseWhole(
      mmStats[formatStatKey("wins", map ?? undefined, "DOUBLE_UP")]
    ),
    deaths: parseWhole(
      mmStats[formatStatKey("deaths", map ?? undefined, "DOUBLE_UP")]
    ),
    suicides: parseWhole(
      mmStats[formatStatKey("suicides", map ?? undefined, "DOUBLE_UP")]
    ),
    kills: parseWhole(
      mmStats[formatStatKey("kills", map ?? undefined, "DOUBLE_UP")]
    ),
    winLossRatio: parseWinLoss(
      parseWhole(mmStats[formatStatKey("wins", map ?? undefined, "DOUBLE_UP")]),
      parseWhole(
        mmStats[formatStatKey("deaths", map ?? undefined, "DOUBLE_UP")]
      )
    ),
    killDeathRatio: parseWinLoss(
      parseWhole(
        mmStats[formatStatKey("kills", map ?? undefined, "DOUBLE_UP")]
      ),
      parseWhole(
        mmStats[formatStatKey("deaths", map ?? undefined, "DOUBLE_UP")]
      )
    ),
    knifeKills: parseWhole(
      mmStats[formatStatKey("knife_kills", map ?? undefined, "DOUBLE_UP")]
    ),
    thrownKnifeKills: parseWhole(
      mmStats[
        formatStatKey("thrown_knife_kills", map ?? undefined, "DOUBLE_UP")
      ]
    ),
    bowKills: parseWhole(
      mmStats[formatStatKey("bow_kills", map ?? undefined, "DOUBLE_UP")]
    ),
    trapKills: parseWhole(
      mmStats[formatStatKey("trap_kills", map ?? undefined, "DOUBLE_UP")]
    ),
    gamesPlayed: parseWhole(
      mmStats[formatStatKey("games", map ?? undefined, "DOUBLE_UP")]
    ),
    detectiveWins: parseWhole(
      mmStats[formatStatKey("detective_wins", map ?? undefined, "DOUBLE_UP")]
    ),
    murdererWins: parseWhole(
      mmStats[formatStatKey("murderer_wins", map ?? undefined, "DOUBLE_UP")]
    ),
    heroWins: parseWhole(
      mmStats[formatStatKey("was_hero", map ?? undefined, "DOUBLE_UP")]
    ),
  };
};

export const formatInfectionStats = (mmStats: any, map?: string) => {
  return {
    coinsPickedUp: parseWhole(
      mmStats[formatStatKey("coins_pickedup", map ?? undefined, "INFECTION")]
    ),
    wins: parseWhole(
      mmStats[formatStatKey("wins", map ?? undefined, "INFECTION")]
    ),
    deaths: parseWhole(
      mmStats[formatStatKey("deaths", map ?? undefined, "INFECTION")]
    ),
    kills: parseWhole(
      mmStats[formatStatKey("kills", map ?? undefined, "INFECTION")]
    ),
    winLossRatio: parseWinLoss(
      parseWhole(mmStats[formatStatKey("wins", map ?? undefined, "INFECTION")]),
      parseWhole(
        mmStats[formatStatKey("deaths", map ?? undefined, "INFECTION")]
      )
    ),
    killDeathRatio: parseWinLoss(
      parseWhole(
        mmStats[formatStatKey("kills", map ?? undefined, "INFECTION")]
      ),
      parseWhole(
        mmStats[formatStatKey("deaths", map ?? undefined, "INFECTION")]
      )
    ),
    bowKills: parseWhole(
      mmStats[formatStatKey("bow_kills", map ?? undefined, "INFECTION")]
    ),
    killsAsInfected: parseWhole(
      mmStats[formatStatKey("kills_as_infected", map ?? undefined, "INFECTION")]
    ),
    killsAsSurvivor: parseWhole(
      mmStats[formatStatKey("kills_as_survivor", map ?? undefined, "INFECTION")]
    ),
    timesLast: parseWhole(
      mmStats[formatStatKey("last_one_alive", map ?? undefined, "INFECTION")]
    ),
    gamesPlayed: parseWhole(
      mmStats[formatStatKey("games", map ?? undefined, "INFECTION")]
    ),
    survivorWins: parseWhole(
      mmStats[formatStatKey("survivor_wins", map ?? undefined, "INFECTION")]
    ),
  };
};

export const formatAssassinsStats = (mmStats: any, map?: string) => {
  return {
    coinsPickedUp: parseWhole(
      mmStats[formatStatKey("coins_pickedup", map ?? undefined, "ASSASSINS")]
    ),
    wins: parseWhole(
      mmStats[formatStatKey("wins", map ?? undefined, "ASSASSINS")]
    ),
    deaths: parseWhole(
      mmStats[formatStatKey("deaths", map ?? undefined, "ASSASSINS")]
    ),
    kills: parseWhole(
      mmStats[formatStatKey("kills", map ?? undefined, "ASSASSINS")]
    ),
    winLossRatio: parseWinLoss(
      parseWhole(mmStats[formatStatKey("wins", map ?? undefined, "ASSASSINS")]),
      parseWhole(
        mmStats[formatStatKey("deaths", map ?? undefined, "ASSASSINS")]
      )
    ),
    killDeathRatio: parseWinLoss(
      parseWhole(
        mmStats[formatStatKey("kills", map ?? undefined, "ASSASSINS")]
      ),
      parseWhole(
        mmStats[formatStatKey("deaths", map ?? undefined, "ASSASSINS")]
      )
    ),
    knifeKills: parseWhole(
      mmStats[formatStatKey("knife_kills", map ?? undefined, "ASSASSINS")]
    ),
    thrownKnifeKills: parseWhole(
      mmStats[
        formatStatKey("thrown_knife_kills", map ?? undefined, "ASSASSINS")
      ]
    ),
    bowKills: parseWhole(
      mmStats[formatStatKey("bow_kills", map ?? undefined, "ASSASSINS")]
    ),
    trapKills: parseWhole(
      mmStats[formatStatKey("trap_kills", map ?? undefined, "ASSASSINS")]
    ),
    gamesPlayed: parseWhole(
      mmStats[formatStatKey("games", map ?? undefined, "ASSASSINS")]
    ),
  };
};
