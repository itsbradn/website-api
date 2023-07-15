import { MinecraftModel } from "../../../../../database/schemas/minecraft";
import { parseWhole } from "../../../../../services/number";
import { Route } from "../../../../interfaces/route";
import {
  getHypixelLeaderboards,
  getHypixelPlayer,
} from "../../../../providers/fetchHypixel";

export const getWizardsDeathsRoute: Route = {
  path: "/wizardsDeaths",
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
          deaths: data.games.tntGames.modes.wizards.deaths,
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
        "games.tntGames.modes.wizards.deaths": { $gt: 0 },
      }).sort({ "games.tntGames.modes.wizards.deaths": -1 });
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
