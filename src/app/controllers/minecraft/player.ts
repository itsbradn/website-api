import { Route } from "../../interfaces/route";

export const getPlayerRoute: Route = {
  path: "/player/:player",
  method: "get",
  actions: [
    async (ctx) => {
      const player = ctx.req.params.player;
      if (!player) {
        return {
          status: 401,
          body: {
            error: "Invalid player",
          },
        };
      }

      const req = await fetch(
        "https://api.ashcon.app/mojang/v2/user/" + player
      ).catch((e) => {});
      if (!req) {
        return {
          status: 400,
          body: {
            error: "Invalid Mojang API Response",
          },
        };
      }
      const data = await req.json();
      type SingleNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      type CreatedDate =
        `${number}-${SingleNumber}${SingleNumber}-${SingleNumber}${SingleNumber}`;

      const parseData = (
        obj: any
      ): {
        uuid: string;
        username: string;
        skin: { slim: boolean; custom: boolean; url: string; data: string };
        cape: { url: string; data: string };
        created: CreatedDate;
      } => {
        if (typeof obj !== "object")
          throw new Error("Invalid Mojang API Response");
        if (obj.error && obj.error == "Not Found")
          throw new Error("User not found");

        return {
          uuid: obj.uuid,
          username: obj.username,
          skin: obj.skin,
          cape: obj.cape,
          created: obj.created_at,
        };
      };

      try {
        const parsed = parseData(data);
        return {
          status: 200,
          body: parsed,
        };
      } catch (e) {
        if (e instanceof Error) {
          return {
            status: 400,
            body: {
              error: e.message,
            },
          };
        }
        return {
          status: 400,
          body: {
            error: "Internal Server Error",
          },
        };
      }
    },
  ],
};
