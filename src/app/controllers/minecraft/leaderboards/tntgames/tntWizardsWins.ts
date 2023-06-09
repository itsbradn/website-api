import { MinecraftModel } from "../../../../../database/schemas/minecraft";
import { parseWhole } from "../../../../../services/number";
import { Route } from "../../../../interfaces/route";
import {
  getHypixelLeaderboards,
  getHypixelPlayer,
} from "../../../../providers/fetchHypixel";

export const getWizardsWinsRoute: Route = {
  path: "/wizardsWins",
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

      if (process.env.FORCE == "true") {
        const hypixelLb = await getHypixelLeaderboards();

        if (typeof hypixelLb === "string")
          return {
            status: 401,
            body: {
              error: hypixelLb,
            },
          };
        const topPlayers: string[] = [];

        const cleanUuid = (uuid: string): string => uuid.replace(/\-/g, "");

        for (const lbPlayer of hypixelLb.data.leaderboards.TNTGAMES.find(
          (v: any) => v.path === "wins_capture"
        ).leaders) {
          topPlayers.push(cleanUuid(lbPlayer));
        }

        const topPlayerDocs = [];

        for (const topPlayer of topPlayers) {
          topPlayerDocs.push(
            parsePlayerLbData(await getHypixelPlayer(topPlayer))
          );
        }

        return {
          status: 200,
          body: {
            leaders: topPlayerDocs,
          },
        };
      }

      const topPlayers = [];

      let index = 0 + page * 25;

      const users = await MinecraftModel.find({
        "games.tntGames.modes.wizards.wins": { $gt: 0 },
      }).sort({ "games.tntGames.modes.wizards.wins": -1 });
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
