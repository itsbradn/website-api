import { Types } from "mongoose";
import { fetchUser } from "../../../database/providers/user";
import { readAccessToken } from "../../../services/jwt";
import { Route } from "../../interfaces/route";

export const getUserRoute: Route = {
  path: "/",
  method: "get",
  actions: [
    async (ctx) => {
      const authCookie = ctx.cookies.get("access-token");
      if (!authCookie)
        return {
          status: 401,
          body: { error: "No access token" },
        };

      const userId = await readAccessToken(authCookie);

      if (userId === "INVALID") return {
        status: 401,
        body: { error: "Invalid access token" },
      }

      const user = await fetchUser(new Types.ObjectId(userId));
      if (!user) return {
        status: 401,
        body: { error: "Invalid access token" },
      }

      return {
        status: 200,
        body: { 
          id: user.id,
          username: user.username,
          email: user.email,
         },
      };
    },
  ],
};
