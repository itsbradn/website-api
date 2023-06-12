import { Controller } from "../../interfaces/controller";
import { getPlayerRoute } from "./player";
import { getTextureRoute } from "./texture";

export const MinecraftController = new Controller(
  "/minecraft",
  [getPlayerRoute, getTextureRoute],
  []
);
