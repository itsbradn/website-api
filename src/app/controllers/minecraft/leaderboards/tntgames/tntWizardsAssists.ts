import { MinecraftModel } from "../../../../../database/schemas/minecraft";
import { parseWhole } from "../../../../../services/number";
import { Route } from "../../../../interfaces/route";
import {
  getHypixelLeaderboards,
  getHypixelPlayer,
} from "../../../../providers/fetchHypixel";

export const getWizardsAssistsRoute: Route = {
  path: "/wizardsAssists",
  method: "get",
  actions: [
    async (ctx) => {
      const queryPage = parseWhole(ctx.req.query.page)
      const page = queryPage < 1 ? 0 : queryPage - 1;

      const parsePlayerLbData = (data: any) => {
        return {
          username: data.username,
          wins: data.games.tntGames.modes.wizards.wins,
          kills: data.games.tntGames.modes.wizards.kills,
          assists: data.games.tntGames.modes.wizards.assists,
          pointsCaptured: data.games.tntGames.modes.wizards.pointsCaptured,
          killDeathRatio: data.games.tntGames.modes.wizards.killDeathRatio,
          killDeathAssistRatio: data.games.tntGames.modes.wizards.killDeathAssistRatio,
          rankData: {
            newPackageRank: data.newPackageRank,
            monthlyPackageRank: data.monthlyPackageRank,
            rankPlusColor: data.rankPlusColor,
            monthlyRankColor: data.monthlyRankColor,
            rank: data.rank,
            prefix: data.prefix,
          }
        };
      };

      const topPlayers = [];

      let index = 0 + page * 25;

      const users = await MinecraftModel.find({
        "games.tntGames.modes.wizards.assists": { $gt: 0 },
      }).sort({ "games.tntGames.modes.wizards.assists": -1 });
      for (const topPlayer of users.slice(index, index + 25)) {
        topPlayers.push(parsePlayerLbData(topPlayer));
      }

      return {
        status: 200,
        body: {
          data: topPlayers,
        },
      };
    },
  ],
};
