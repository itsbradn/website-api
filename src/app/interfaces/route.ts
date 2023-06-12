import Application from "koa";
import { Next, Response, isNext } from "./response";
import Router from "@koa/router";
import * as Cookies from "cookies";
import { type IncomingHttpHeaders } from "http";

export type HTTPMethods = "get" | "post" | "put" | "options" | "delete";

export interface Route {
  path: string;
  method: HTTPMethods;
  actions: Array<
    (ctx: RouteContext) => Promise<Next | Response> | Next | Response
  >;
}

export class RouteHandler {
  public actions: Array<
    (ctx: RouteContext) => Promise<Next | Response> | Next | Response
  > = [];
  constructor(
    public path: string,
    public method: HTTPMethods,
    ...action: Array<
      (ctx: RouteContext) => Promise<Next | Response> | Next | Response
    >
  ) {
    action.forEach((a) => this.actions.push(a));
  }

  // deno-lint-ignore no-explicit-any
  async run(
    ctx: Application.ParameterizedContext<
      Application.DefaultState,
      Application.DefaultContext &
        Router.RouterParamContext<
          Application.DefaultState,
          Application.DefaultContext
        >,
      unknown
    >
  ) {
    console.log("Running route handler: " + this.path); // TODO: Custom logger implementation
    let routeContext: RouteContext = {
      route: {
        path: this.path,
        method: this.method,
        app: ctx.app,
      },
      cookies: ctx.cookies,
      req: {
        body: ctx.request.rawBody,
        bodyJson:
          (typeof ctx.request.body === "object" ? ctx.request.body : {}) ?? {},
        headers: ctx.request.headers,
        ip: ctx.request.ip,
        params: ctx.params,
        query: ctx.query,
      },
      res: {
        status: 501,
        body: "Not Implemented",
      },
      options: {},
    };
    for (const action of this.actions) {
      const res = await action(routeContext);
      console.log("Action returned: " + res); // TODO: Custom logger implementation

      if (isNext(res)) {
        routeContext = (res as Next).ctx;
        continue;
      }

      ctx.response.status = (res as Response).status;
      ctx.response.body = (res as Response).body;
      if ((res as Response).contentType) {
        ctx.set("Content-Type", (res as Response).contentType as string);
      }
      return;
    }

    if (isNext(routeContext.res)) {
      ctx.response.status = 501;
      ctx.response.body = "Not Implemented";
      ctx.set("Content-Type", "text/plain");
      return;
    }
    routeContext.res = routeContext.res as Response;
    ctx.response.status = routeContext.res.status;
    ctx.response.body = routeContext.res.body;

    if (routeContext.res.contentType) {
      ctx.set("Content-Type", routeContext.res.contentType);
    }
  }
}

export interface RouteContext {
  route: {
    path: string;
    method: HTTPMethods;
    // deno-lint-ignore no-explicit-any
    app: Application<Record<string, any>>;
  };
  cookies: Cookies;
  req: {
    body: unknown;
    bodyJson: object;
    headers: IncomingHttpHeaders;
    ip: string;
    params: Record<string | number, string | undefined>;
    query: NodeJS.Dict<string | string[]>;
  };
  res: Response | Next;
  // deno-lint-ignore ban-types
  options: Record<string, string | object | number>;
}
