import { Controller } from "../../interfaces/controller";
import { getUserRoute } from "./get";
import { UserSignUpRoute } from "./signup";

export const UserController = new Controller('/user', [UserSignUpRoute, getUserRoute], []);