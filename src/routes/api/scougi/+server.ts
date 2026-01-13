import { ScougiTable } from "$lib/db/schema";
import db from "$lib/server/db";
import { captureException } from "@sentry/sveltekit";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import z from "zod";
import { createScougiReq } from "$lib/schemas";

export const POST: RequestHandler = async (evt) => {
  const rawBody = await evt.request.json();
  const { success, data: body, error: parseError } = z.safeParse(createScougiReq, rawBody);
  if (!success) {
    error(400, { message: `Body contains invalid structure: ${z.prettifyError(parseError)}` })
  }
  try {
    const resp = await db.insert(ScougiTable).values({
      year: body.year,
      trim: body.trim,
      pages: body.pages
    }).returning();
    return json(resp[0]);
  } catch (e) {
    console.error(e)
    captureException(e)
    error(500, {
      message: "Failed to create scougi"
    })
  }
}
