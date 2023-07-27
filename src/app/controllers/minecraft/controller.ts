import { Controller } from "../../interfaces/controller";
import { AppController } from "../app";
import { getHypixelRoute } from "./hypixel";
import { getHypixelGamesRoute } from "./hypixelGameResources";
import { getLandingRoute } from "./landing";
import { HypixelLeaderboardsController } from "./leaderboards/controller";
import { getPlayerRoute } from "./player";
import { getTextureRoute } from "./texture";
import { getThumbnailRoute } from "./thumbnail";

export const MinecraftController = new Controller(
  "/minecraft",
  [getPlayerRoute, getTextureRoute, getHypixelRoute, getLandingRoute, getThumbnailRoute, getHypixelGamesRoute],
  [],
  null,
  [HypixelLeaderboardsController]
);
