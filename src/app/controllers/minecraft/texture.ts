import axios from "axios";
import { Route } from "../../interfaces/route";

export const getTextureRoute: Route = {
  path: "/texture/:id",
  method: "get",
  actions: [
    async (ctx) => {
      const id = ctx.req.params.id;
      if (!id) {
        return {
          status: 401,
          body: {
            error: "Invalid Texture ID",
          },
        };
      }

      return {
        status: 200,
        body: (
          await axios.get("https://textures.minecraft.net/texture/" + id, {
            responseType: "arraybuffer",
          })
        ).data,
        contentType: "image/png",
      };
    },
  ],
};
