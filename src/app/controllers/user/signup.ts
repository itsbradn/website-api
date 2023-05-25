import { createUser } from "../../../database/providers/user";
import { getAccessTokens } from "../../../services/jwt";
import { Route } from "../../interfaces/route";

export const UserSignUpRoute: Route = {
  path: "/",
  method: "post",
  actions: [
    async (ctx) => {
      let { body } = ctx.req;


      if (typeof body === 'string') body = JSON.parse(body);
      
      const { email, username, password } = body as Record<string, any>;


      if (email == undefined || email == null || typeof email !== "string") {
        return {
          status: 400,
          body: { error: "Invalid Email" },
        };
      }

      if (
        username == undefined ||
        username == null ||
        typeof username !== "string"
      ) {
        return {
          status: 400,
          body: { error: "Invalid Username" },
        };
      }
      if (username.length < 3)
        return {
          status: 400,
          body: { error: "Username too short" },
        };
      if (username.length > 16)
        return {
          status: 400,
          body: { error: "Username too long" },
        };

      if (
        password == undefined ||
        password == null ||
        typeof password !== "string"
      ) {
        return {
          status: 400,
          body: { error: "Invalid Password" },
        };
      }
      if (password.length < 6)
        return {
          status: 400,
          body: { error: "Password too short" },
        };

      const createRes = await createUser(username, email, password);
      if (createRes === "EMAIL_TAKEN" || createRes === "USERNAME_TAKEN")
        return {
          status: 409,
          body: { error: "Email or username taken" },
        };

      const tokens = await getAccessTokens(createRes);

      ctx.cookies.set('access-token', tokens.accessToken);

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
