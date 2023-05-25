import Koa from 'koa';
import Router from '@koa/router';
import { AppController } from './app/controllers/app';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
app.use(bodyParser({ enableTypes: ["json"]}));

const router = new Router();

AppController.loadRoutes(router);

app.use(router.routes());


app.listen({ port: 8000 });