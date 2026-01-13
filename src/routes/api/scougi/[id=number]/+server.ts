import { ScougiPageTable, ScougiTable } from "$lib/db/schema";
import db from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";

export const DELETE: RequestHandler = async (evt) => {
  const scougiId = Number(evt.params.id);
  try {
    await db.delete(ScougiPageTable).where(eq(ScougiPageTable.id, scougiId));
    await db.delete(ScougiTable).where(eq(ScougiTable.id, scougiId));
    return new Response(undefined, { status: 200 });
  } catch (e) {
    console.error(e)
    error(500, "Failed to delete scougi");
  }
}
