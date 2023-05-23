import { Application, Router } from 'https://deno.land/x/oak@v12.4.0/mod.ts';
import { AppController } from './app/controllers/app.ts';

const app = new Application();
const router = new Router();

AppController.loadRoutes(router);

app.use(router.routes());


await app.listen({ port: 8000 });