import { Controller } from "../interfaces/controller";
import { DocumentationController } from "./docs/controller";
import { IndexRoute } from "./index";
import { SessionController } from "./session/controller";
import { UserController } from "./user/controller";

export const AppController = new Controller('/api/v1', [IndexRoute], [], null, [UserController, SessionController, DocumentationController]);