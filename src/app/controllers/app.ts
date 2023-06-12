import { Controller } from "../interfaces/controller";
import { IndexRoute } from "./index";
import { MinecraftController } from "./minecraft/controller";
import { SessionController } from "./session/controller";
import { UserController } from "./user/controller";

export const AppController = new Controller('/api/v1', [IndexRoute], [], null, [UserController, SessionController, MinecraftController]);