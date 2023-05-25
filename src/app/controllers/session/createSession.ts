import { UserModel } from "../../../database/schemas/user";
import { oneWayCheck } from "../../../services/hash";
import { getAccessTokens } from "../../../services/jwt";
import { Route } from "../../interfaces/route";

export const createSessionRoute: Route = {
  path: "/",
  method: "post",
  actions: [
    async (ctx) => {
      let { body } = ctx.req;

      if (typeof body === "string") body = JSON.parse(body);

      const { username, password } = body as Record<string, any>;
      if (
        username == undefined ||
        username == null ||
        typeof username !== "string"
      ) {
        return {
          status: 400,
          body: { error: "Invalid Login" },
        };
      }

      if (
        password == undefined ||
        password == null ||
        typeof password !== "string"
      ) {
        return {
          status: 400,
          body: { error: "Invalid Login" },
        };
      }

      const user = await UserModel.findOne({ username });
      if (!user)
        return {
          status: 400,
          body: { error: "Invalid Login" },
        };

      const validPass = await oneWayCheck(password, user.passwordHash);
      if (!validPass)
        return {
          status: 400,
          body: { error: "Invalid Login" },
        };

      const tokens = await getAccessTokens(user);

      ctx.cookies.set("access-token", tokens.accessToken);

      return {
        status: 200,
        body: {
          refresh: tokens.refresh,
          access: tokens.accessToken,
        },
      };
    },
  ],
};
