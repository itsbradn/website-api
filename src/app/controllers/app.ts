import { Controller } from "../interfaces/controller.ts";
import { IndexRoute } from "./index.ts";

export const AppController = new Controller('/api/v1', [IndexRoute], []);