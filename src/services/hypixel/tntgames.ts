import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { parsePercentage, parseWhole, parseWinLoss } from "../number";

dayjs.extend(duration);

export interface TNTGamesStats {
  wins: number;
  winstreak: number;
  coins: number;
  particleEffect: string;
  deathEffect: string;
  voidMessage: string;
  hat: string;
  doubleJumpEffect: string;
  playtime: string;
  settings: {
    wizardsActionBar: string;
    runActionBar: string;
    tagActionBar: string;
    tipHolograms: string;
    wizardsCooldownMessages: string;
    doubleJumpFeather: string;
    wizardsPrestigeParticles: string;
  };

  modes: {
    bowSpleef: {
      wins: number;
      deaths: number;
      shotsLanded: number;
      winLossRatio: number;
      shotsGameRatio: number;
    };
    tntRun: {
      wins: number;
      deaths: number;
      record: string;
      winLossRatio: number;
      blocksRan: number;
      potionsLanded: number;
    };
    pvpRun: {
      wins: number;
      kills: number;
      deaths: number;
      record: string;
      winLossRatio: number;
      killDeathRatio: number;
      killGameRatio: number;
    };
    tntTag: {
      wins: number;
      kills: number;
      deaths: number;
      tags: number;
      tagKillRatio: number;
      killWinRatio: number;
      winLossRatio: number;
    };
    wizards: {
      wins: number;
      killDeathRatio: number;
      killDeathAssistRatio: number;
      kills: number;
      deaths: number;
      assists: number;
      pointsCaptured: number;
      prestigeAchievementProgress: number;
      classes: {
        class: string;
        kills: number;
        deaths: number;
        assists: number;
        killDeathRatio: number;
        healed: number;
        damageRecieved: number;
        power: number;
        mana: number;
        prestige: string;
      }[];
    };
  };
}

export const formatTntGamesStats = (
  hypixelRes: any
): { tntGames?: TNTGamesStats } => {
  if (!hypixelRes || !hypixelRes["stats"] || !hypixelRes["stats"]["TNTGames"])
    return {};

  const tntStats = hypixelRes["stats"]["TNTGames"];

  return {
    tntGames: {
      wins: parseWhole(tntStats["wins"]),
      winstreak: parseWhole(tntStats["winstreak"]),
      coins: parseWhole(tntStats["coins"]),
      particleEffect: capAndSpaceEffect(tntStats["new_active_particle_effect"]),
      deathEffect: capAndSpaceEffect(tntStats["new_active_death_effect"]),
      voidMessage: capAndSpaceEffect(tntStats["active_void_message"]),
      hat: capAndSpaceEffect(tntStats["new_selected_hat"]),
      doubleJumpEffect: capAndSpaceEffect(
        tntStats["new_double_jump_effect"],
        "dje_"
      ),
      playtime: calculateTntGamesPlaytime(hypixelRes),
      settings: {
        wizardsActionBar: formatBool(
          tntStats.flags?.show_wizards_actionbar_info,
          true
        ),
        runActionBar: formatBool(
          tntStats.flags?.show_tntrun_actionbar_info,
          true
        ),
        tagActionBar: formatBool(
          tntStats.flags?.show_tnttag_actionbar_info,
          true
        ),
        tipHolograms: formatBool(tntStats.flags?.show_tip_holograms, true),
        wizardsCooldownMessages: formatBool(
          tntStats.flags?.show_wizards_cooldown_notifications,
          true
        ),
        doubleJumpFeather: formatBool(tntStats.flags?.give_dj_feather, true),
        wizardsPrestigeParticles: formatBool(
          tntStats.flags?.show_wiz_pres,
          true
        ),
      },
      modes: {
        bowSpleef: {
          wins: parseWhole(tntStats["wins_bowspleef"]),
          deaths: parseWhole(tntStats["deaths_bowspleef"]),
          shotsLanded: parseWhole(tntStats["tags_bowspleef"]),
          winLossRatio: parseWinLoss(
            tntStats["wins_bowspleef"],
            parseWhole(tntStats["deaths_bowspleef"])
          ),
          shotsGameRatio: parseWinLoss(
            tntStats["tags_bowspleef"],
            parseWhole(tntStats["deaths_bowspleef"]) +
              parseWhole(tntStats["wins_bowspleef"])
          ),
        },
        tntRun: {
          wins: parseWhole(tntStats["wins_tntrun"]),
          deaths: parseWhole(tntStats["deaths_tntrun"]),
          record: calculateRunRecord(tntStats),
          winLossRatio: parseWinLoss(
            tntStats["wins_tntrun"],
            tntStats["deaths_tntrun"]
          ),
          blocksRan: parseWhole(hypixelRes.achievements?.tntgames_block_runner),
          potionsLanded: parseWhole(
            tntStats["run_potions_splashed_on_players"]
          ),
        },
        pvpRun: {
          wins: parseWhole(tntStats["wins_pvprun"]),
          kills: parseWhole(tntStats["kills_pvprun"]),
          deaths: parseWhole(tntStats["deaths_pvprun"]),
          record: calculateRunRecord(tntStats["record_pvprun"]),
          winLossRatio: parseWinLoss(
            tntStats["wins_pvprun"],
            tntStats["deaths_pvprun"]
          ),
          killDeathRatio: parseWinLoss(
            tntStats["kills_pvprun"],
            tntStats["deaths_pvprun"]
          ),
          killGameRatio: parseWinLoss(
            tntStats["kills_pvprun"],
            parseWhole(tntStats["deaths_pvprun"]) +
              parseWhole(tntStats["wins_pvprun"])
          ),
        },
        tntTag: {
          wins: parseWhole(tntStats["wins_tntag"]),
          kills: parseWhole(tntStats["kills_tntag"]),
          deaths: parseWhole(tntStats["deaths_tntag"]),
          tags: parseWhole(hypixelRes.achievements?.tntgames_clinic),
          tagKillRatio: parseWinLoss(
            hypixelRes.achievements?.tntgames_clinic,
            tntStats["kills_tntag"]
          ),
          killWinRatio: parseWinLoss(
            tntStats["kills_tntag"],
            tntStats["wins_tntag"]
          ),
          winLossRatio: parseWinLoss(
            tntStats["wins_tntag"],
            tntStats["deaths_tntag"]
          ),
        },
        wizards: {
          wins: parseWhole(tntStats["wins_capture"]),
          killDeathRatio: parseWinLoss(
            tntStats["kills_capture"],
            tntStats["deaths_capture"]
          ),
          killDeathAssistRatio: parseWinLoss(
            parseWhole(tntStats["kills_capture"]) +
              parseWhole(tntStats["assists_capture"]),
            tntStats["deaths_capture"]
          ),
          kills: parseWhole(tntStats["kills_capture"]),
          deaths: parseWhole(tntStats["deaths_capture"]),
          assists: parseWhole(tntStats["assists_capture"]),
          pointsCaptured: parseWhole(tntStats["points_capture"]),
          prestigeAchievementProgress: parsePercentage(hypixelRes['achievements']?.tntgames_tnt_wizards_kills, 10000),
          classes: calculateWizardsClasses(tntStats),
        },
      },
    },
  };
};

/**
 * Thank you to [Plotzes]{@link https://github.com/ImPlotzes} for helping me figure out how to calculate playtime.
 *
 * All playtime is under the "tntgames_tnt_triathlon" achievement in minutes
 */
export const calculateTntGamesPlaytime = (hypixelRes: any) => {
  const achievement = hypixelRes.achievements["tntgames_tnt_triathlon"];
  if (!achievement) return "Has not played";
  const day = dayjs.duration(achievement as number, "minutes");
  const hours = Math.floor(day.as("hours"));
  return (
    hours.toLocaleString() +
    " hours and " +
    Math.floor(day.subtract(hours, "hours").as("minutes")).toLocaleString() +
    " minutes"
  );
};

export const calculateRunRecord = (tntStats: any) => {
  const record = tntStats?.record_tntrun;
  if (!record) return "No record";
  const day = dayjs.duration(record as number, "seconds");
  const minutes = Math.floor(day.as("minutes"));
  const seconds = day.subtract(minutes, "minutes").as("seconds");
  return minutes.toLocaleString() + " minutes and " + seconds + " seconds";
};

export const capAndSpaceEffect = (str?: any, rem?: string) => {
  if (str == undefined || typeof str !== "string") return "None";
  let newStr = str;
  if (rem) newStr = newStr.replace(rem, "");
  let spaced = newStr.replace(/_/g, " ");
  return spaced[0].toUpperCase() + spaced.substring(1);
};

export const formatBool = (bool?: any, def?: boolean) => {
  if (bool === undefined) return def ? "True" : "False";
  if (typeof bool == "boolean") return bool ? "True" : "False";
  if (typeof bool == "string") return bool.includes("true") ? "True" : "False";
  if (typeof bool == "number") return bool > 0 ? "True" : "False";
  return def ? "True" : "False";
};

// key prefixes for wizards, usually followed by "_assists" or "_deaths" etc in stats.
let wizardKeys = [
  "new_ancientwizard",
  "new_bloodwizard",
  "new_firewizard",
  "new_hydrowizard",
  "new_icewizard",
  "new_kineticwizard",
  "new_stormwizard",
  "new_toxicwizard",
  "new_witherwizard",
];

export const calcWizardsOverallStats = (tntStats: any) => {
  if (!tntStats) {
    return {
      deaths: 0,
      assists: 0,
    };
  }

  let deaths = 0;
  let assists = 0;

  for (const wizard of wizardKeys) {
    deaths += parseWhole(tntStats[wizard + "_deaths"]);
    assists += parseWhole(tntStats[wizard + "_assists"]);
  }

  if (deaths == 0 && parseWhole(tntStats["deaths_capture"]) > 0)
    deaths = parseWhole(tntStats["deaths_capture"]);
  if (assists == 0 && parseWhole(tntStats["assists_capture"]) > 0)
    assists = parseWhole(tntStats["assists_capture"]);

  return {
    deaths,
    assists,
  };
};

export const calculateWizardsClasses = (tntStats: any) => {
  let res: {
    class: string;
    kills: number;
    deaths: number;
    assists: number;
    killDeathRatio: number;
    healed: number;
    damageRecieved: number;
    power: number;
    mana: number;
    prestige: string;
  }[] = [];

  for (const wizard of wizardKeys) {
    let name = wizard.replace("new_", "").replace("wizard", "");
    res.push({
      class: name[0].toUpperCase() + name.substring(1),
      kills: parseWhole(tntStats[wizard + "_kills"]),
      deaths: parseWhole(tntStats[wizard + "_deaths"]),
      assists: parseWhole(tntStats[wizard + "_assists"]),
      killDeathRatio: parseWinLoss(
        tntStats[wizard + "_kills"],
        tntStats[wizard + "_deaths"]
      ),
      healed: parseWhole(tntStats[wizard + "_healing"]),
      damageRecieved: parseWhole(tntStats[wizard + "_damage_taken"]),
      power: parseWhole(tntStats[wizard + "_explode"]),
      mana: parseWhole(tntStats[wizard + "_regen"]),
      prestige: formatBool(isClassPrestiged(wizard, tntStats), false),
    });
  }

  return res;
};

export const isClassPrestiged = (key: string, tntStats: any): boolean => {
  return tntStats["packages"].includes(key + "_prestige");
};
