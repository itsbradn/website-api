import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { Guard } from "./guard.ts";
import { Route, RouteHandler } from "./route.ts";

export class Controller {
  constructor(
    public prefix: string,
    public routes: Array<Route>,
    public guards: Array<Guard>,
    public parentController: Controller | null = null,
    public childControllers: Array<Controller> = []
  ) {}

  public loadRoutes(router: Router): boolean {
    this.prefix = this.parentController
      ? this.parentController.prefix + this.prefix
      : this.prefix;

    for (const route of this.routes) {
      const handler = new RouteHandler(
        this.prefix + route.path,
        route.method,
        ...route.actions
      );

      router.add(route.method, this.parsePath(this.prefix + route.path), async (ctx) => {
        console.log("test");
        await handler.run(ctx);
      });
      console.log("Loaded route: " + this.parsePath(this.prefix + route.path)); // TODO: Custom logger implementation
    }

    for (const controller of this.childControllers) {
      controller.loadRoutes(router);
      console.log("Loaded controller: " + controller.prefix); // TODO: Custom logger implementation
    }

    return true;
  }

  parsePath(path: string): string {
    return path.endsWith("/") ? path.slice(0,-1) : path;
  }
}
