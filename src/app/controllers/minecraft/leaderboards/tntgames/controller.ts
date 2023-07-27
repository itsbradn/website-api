import { Controller } from "../../../../interfaces/controller";
import { getWizardsAssistsRoute } from "./tntWizardsAssists";
import { getWizardsDeathsRoute } from "./tntWizardsDeaths";
import { getWizardsKillsRoute } from "./tntWizardsKills";
import { getWizardsWinsRoute } from "./tntWizardsWins";

export const TntGamesLeaderboardsController = new Controller(
  "/tntgames",
  [getWizardsWinsRoute, getWizardsAssistsRoute, getWizardsDeathsRoute, getWizardsKillsRoute],
  [],
);
