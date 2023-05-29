import { Controller } from "../../interfaces/controller";
import { getPageRoute } from "./getPage";

export const DocumentationController = new Controller(
  "/docs",
  [getPageRoute],
  []
);
