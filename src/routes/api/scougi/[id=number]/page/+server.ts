import { ScougiPageTable, ScougiTable } from "$lib/db/schema";
import db from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import z from "zod";
import { error, json } from "@sveltejs/kit";
import { createPageReq } from "$lib/schemas";

export const GET: RequestHandler = async (evt) => {
  const scougiId = Number(evt.params.id);
  const { data: pageNr, success } = z.safeParse(z.number(), Number(evt.url.searchParams.get("pageNr")));
  if (!success) {
    error(500, { message: "pageNr parameter is missing or not a number" })
  }
  const page = await db.query.ScougiPageTable.findFirst({
    where: and(eq(ScougiPageTable.id, scougiId), eq(ScougiPageTable.number, pageNr))
  })

  if (!page) {
    error(404, { message: "No page data found" });
  }
  return json(page);
}

export const POST: RequestHandler = async (evt) => {
  const scougiId = Number(evt.params.id);
  const bodyRaw = await evt.request.json();
  const { data: body, error: parseError } = z.safeParse(createPageReq, bodyRaw);
  if (parseError) {
    error(500, { message: `Body is invalid: ${z.prettifyError(parseError)}` });
  }

  const scougi = await db.query.ScougiTable.findFirst({ where: eq(ScougiTable.id, scougiId) })
  if (!scougi) {
    error(404, { message: "No scougi found for given id" });
  }

  await db.insert(ScougiPageTable).values({
    id: scougi.id,
    data: body.data,
    number: body.page,
  });
  return new Response(undefined, { status: 200 })
}
