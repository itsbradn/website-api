import "dotenv/config";
import Koa from "koa";
import Router from "@koa/router";
import { AppController } from "./app/controllers/app";
import bodyParser from "koa-bodyparser";
import { databaseInit } from "./database/providers/login";
import cors from 'koa-cors';


const main = async () => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(cors({
    origin: '*'
  }))

  await databaseInit();

  const router = new Router();
  AppController.loadRoutes(router);
  app.use(router.routes());

  app.listen({ port: process.env.PORT! }, () => {
    console.log(`Now listening on port ${process.env.PORT}`)
  });
};

main();
