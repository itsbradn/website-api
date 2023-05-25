import { Status } from "https://deno.land/x/oak@v12.4.0/deps.ts";
import { RouteContext } from "./route.ts";

export interface Response {
  status: Status;
  body: string | Uint8Array | Deno.Reader | Record<string, unknown>;
}

export interface Next {
  ctx: RouteContext;
}

export function isNext(object: Next | Response): object is Next {
  return 'ctx' in object;
}