import { Controller } from "../../interfaces/controller";
import { UserSignUpRoute } from "./signup";

export const UserController = new Controller('/user', [UserSignUpRoute], []);