import { Controller } from "../../../interfaces/controller";
import { MinecraftController } from "../controller";
import { TntGamesLeaderboardsController } from "./tntgames/controller";

export const HypixelLeaderboardsController = new Controller(
  "/hypixel/leaderboards",
  [],
  [],
  null, [TntGamesLeaderboardsController]
);
