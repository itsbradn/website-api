import { Controller } from "../../interfaces/controller";
import { createSessionRoute } from "./createSession";

export const SessionController = new Controller('/session', [createSessionRoute], []);