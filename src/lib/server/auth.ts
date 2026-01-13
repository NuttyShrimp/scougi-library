import { error, type RequestEvent } from "@sveltejs/kit";

export const enforceAuth = (evt: RequestEvent) => {
  if (!evt.locals.user || !evt.locals.session) {
    return error(401);
  }
}
