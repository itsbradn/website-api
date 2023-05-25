import { Controller } from "../interfaces/controller";
import { IndexRoute } from "./index";

export const AppController = new Controller('/api/v1', [IndexRoute], []);