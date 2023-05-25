import { RouteContext } from "./route";

export interface Response {
  status: number;
  body: string | Uint8Array | Record<string, unknown>;
}

export interface Next {
  ctx: RouteContext;
}

export function isNext(object: Next | Response): object is Next {
  return (object as Next).ctx !== undefined;
}
