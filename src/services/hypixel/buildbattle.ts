import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { parseWhole, parseWinLoss } from "../number";

dayjs.extend(duration);

export interface BuildBattleStats {
  wins: number;
  coins: number;
  gamesPlayed: number;
  winsGamesPlayed: number;
  timesVoted: number;
  score: number;
  modes: {
    soloNormal: {
      wins: number;
    };
    soloPro: {
      wins: number;
    };
    teamsNormal: {
      wins: number;
      highestPoints: number;
    };
    guessTheBuild: {
      wins: number;
      correctGuesses: number;
    };
  };
}

export const formatBuildBattleStats = (
  hypixelRes: any
): { buildBattle?: BuildBattleStats } => {
  if (
    !hypixelRes ||
    !hypixelRes["stats"] ||
    !hypixelRes["stats"]["BuildBattle"]
  )
    return {};

  const bbStats = hypixelRes["stats"]["BuildBattle"];

  return {
    buildBattle: {
      wins: parseWhole(bbStats["wins"]),
      coins: parseWhole(bbStats["coins"]),
      gamesPlayed: parseWhole(bbStats["games_played"]),
      winsGamesPlayed: parseWinLoss(bbStats["wins"], bbStats["games_played"]),
      timesVoted: parseWhole(bbStats["total_votes"]),
      score: parseWhole(bbStats["score"]),
      modes: {
        soloNormal: {
          wins: bbStats["wins_solo_normal"],
        },
        soloPro: {
          wins: bbStats["wins_solo_pro"],
        },
        teamsNormal: {
          wins: bbStats["wins_teams_normal"],
          highestPoints: bbStats["teams_most_points"],
        },
        guessTheBuild: {
          wins: bbStats["wins_guess_the_build"],
          correctGuesses: bbStats["correct_guesses"],
        },
      },
    },
  };
};
