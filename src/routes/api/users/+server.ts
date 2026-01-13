import db from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { userTable } from "$lib/db/schema";
import { json } from "@sveltejs/kit";
import { enforceAuth } from "$lib/server/auth";

export const GET: RequestHandler = async (evt) => {
  enforceAuth(evt);

  const users = await db.query.userTable.findMany({
    where: eq(userTable.approved, false)
  })

  return json(users);
}
