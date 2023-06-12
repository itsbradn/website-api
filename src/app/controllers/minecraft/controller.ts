import { Controller } from "../../interfaces/controller";
import { getPlayerRoute } from "./player";

export const MinecraftController = new Controller(
  "/minecraft",
  [getPlayerRoute],
  []
);
