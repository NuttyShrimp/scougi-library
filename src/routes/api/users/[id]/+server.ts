import { enforceAuth } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/server/db";
import { userTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async (evt) => {
  enforceAuth(evt);
  if (!evt.locals.user?.approved) {
    return error(403, { message: "You need to be approved to do this" });
  }
  const userId = evt.params.id;

  await db.update(userTable).set({
    approved: true
  }).where(eq(userTable.id, userId))
  return new Response(undefined, { status: 200 })
}
