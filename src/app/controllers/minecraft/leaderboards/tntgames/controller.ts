import { Controller } from "../../../../interfaces/controller";
import { HypixelLeaderboardsController } from "../controller";
import { getWizardsWinsRoute } from "./tntWizardsWins";

export const TntGamesLeaderboardsController = new Controller(
  "/tntgames",
  [getWizardsWinsRoute],
  [],
);
