import "dotenv/config";
import Koa from "koa";
import Router from "@koa/router";
import { AppController } from "./app/controllers/app";
import bodyParser from "koa-bodyparser";
import { databaseInit } from "./database/providers/login";

const main = async () => {
  const app = new Koa();
  app.use(bodyParser({ enableTypes: ["json"] }));

  await databaseInit();

  const router = new Router();
  AppController.loadRoutes(router);
  app.use(router.routes());

  app.listen({ port: 8000 });
};

main();
