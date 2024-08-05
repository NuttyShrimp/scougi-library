import db from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { ScougiTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";
import { trpcServer } from "$lib/server";

export const ssr = false;

export const load: PageServerLoad = async (evt) => {
  const { params, url } = evt;
  const scougi = await db.query.ScougiTable.findFirst({
    where: and(eq(ScougiTable.year, params.year), eq(ScougiTable.trim, Number(params.trim)))
  })
  if (!scougi) {
    error(404, "Scougi not found");
  }
  let defaultPage = Number(url.searchParams.get("page"))
  if (Number.isNaN(defaultPage)) {
    defaultPage = 1;
  }
  if (defaultPage < 1) {
    defaultPage = 1;
  }
  if (defaultPage > scougi.pages) {
    defaultPage = scougi.pages;
  }
  trpcServer.scougi.page.ssr({ scougi_id: scougi.id, page: defaultPage - 1 }, evt);
  return { scougi, page: defaultPage }
}
