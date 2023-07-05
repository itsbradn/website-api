import axios from "axios";
import { Route } from "../../interfaces/route";
import { readFileSync } from "fs";
import { checkCacheByPlayername } from "../../../database/providers/minecraft";
import puppeteer from "puppeteer";
import { resolve } from "path";

export const getThumbnailRoute: Route = {
  path: "/thumbnail/:player",
  method: "get",
  actions: [
    async (ctx) => {
      const player = ctx.req.params.player;
      if (!player) {
        return {
          status: 401,
          body: {
            error: "Invalid Player",
          },
        };
      }

      const cacheData = await checkCacheByPlayername(player, "mojang");
      if (!cacheData.data) {
        return {
          status: 401,
          body: {
            error: "Uncached",
          },
        };
      }

      let html = readFileSync(resolve("./src/app/data/thumbnail.html"), {
        encoding: "utf-8",
      });

      html = html.replace(/\$\$USERNAME\$\$/g, cacheData.data.username);
      html = html.replace(
        /\$\$VIEWS\$\$/g,
        cacheData.data.viewers.length.toLocaleString()
      );
      html = html.replace(
        /\$\$SKINURL\$\$/g,
        `"` + cacheData.data.skin.url + `"`
      );

      const browser = await puppeteer.launch({
        headless: 'new',
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1200,
        height: 675,
        deviceScaleFactor: 1,
      });

      await page.setContent(html);
      function delay(time: number) {
        return new Promise(function (resolve) {
          setTimeout(resolve, time);
        });
      }
      await delay(500);
      const img = await page.screenshot();
      await browser.close();

      return {
        status: 200,
        body: img,
        contentType: "image/png",
      };
    },
  ],
};
