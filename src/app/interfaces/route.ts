import { Body } from "https://deno.land/x/oak@v12.4.0/body.ts";
import { Next, Response } from "./response.ts";
import { SecureCookieMap } from "https://deno.land/x/oak@v12.4.0/deps.ts";
import {
  Application,
  BodyBytes,
  BodyJson,
  BodyText,
  HTTPMethods,
  RouterContext,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { resolve } from "https://deno.land/std@0.185.0/path/win32.ts";

export interface Route {
  path: string;
  method: HTTPMethods;
  actions: Array<(ctx: RouteContext) => Promise<Next | Response> | Next | Response>;
}

export class RouteHandler {
  public actions: Array<(ctx: RouteContext) => Promise<Next | Response> | Next | Response> = [];
  constructor(
    public path: string,
    public method: HTTPMethods,
    ...action: Array<(ctx: RouteContext) => Promise<Next | Response> | Next | Response>
  ) {
    action.forEach((a) => this.actions.push(a));
  }

  // deno-lint-ignore no-explicit-any
  async run(ctx: RouterContext<any, any, any>) {
    console.log("Running route handler: " + this.path); // TODO: Custom logger implementation
    let routeContext: RouteContext = {
      route: {
        path: this.path,
        method: this.method,
        app: ctx.app,
      },
      cookies: ctx.cookies,
      req: {
        body: ctx.request.body(),
        bodyBytes: ctx.request.body({ type: "bytes" }),
        bodyJson: ctx.request.body({ type: "json" }),
        bodyText: ctx.request.body({ type: "text" }),
        headers: ctx.request.headers,
        ip: ctx.request.ip,
        params: ctx.params,
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

      // deno-lint-ignore no-prototype-builtins
      if (res.hasOwnProperty("ctx")) {
        routeContext = (res as Next).ctx;
        continue;
      }

      ctx.response.status = (res as Response).status;
      ctx.response.body = (res as Response).body;
      return;
    }

    if (routeContext.res.hasOwnProperty('ctx')) {
      ctx.response.status = 501;
      ctx.response.body = "Not Implemented";
      ctx.response.headers.set("Content-Type", "text/plain");
      return;
    }
    routeContext.res = routeContext.res as Response;
    ctx.response.status = routeContext.res.status;
    ctx.response.body = routeContext.res.body;
  }
}

export interface RouteContext {
  route: {
    path: string;
    method: HTTPMethods;
    app: Application<Record<string, any>>;
  };
  cookies: SecureCookieMap;
  req: {
    body: Body;
    bodyBytes: BodyBytes;
    bodyJson: BodyJson;
    bodyText: BodyText;
    headers: Headers;
    ip: string;
    params: Record<string | number, string | undefined>;
  };
  res: Response | Next;
  options: Record<string, string | object | number>;
}
