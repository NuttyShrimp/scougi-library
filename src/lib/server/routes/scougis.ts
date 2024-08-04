import { protectedProcedure, publicProcedure, router } from "$lib/server/trpc";
import { z } from "zod";
import db from "../db";
import { ScougiPageTable, ScougiTable } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const scougiRouter = router({
  all: publicProcedure.query(async () => {
    const scougis = await db.query.ScougiTable.findMany({
      orderBy: (s, { desc }) => [desc(s.year), desc(s.trim)],
    });

    return scougis
  }),
  delete: protectedProcedure.input(z.object({
    id: z.number()
  })).mutation(async ({ input }) => {
    try {
      await db.delete(ScougiPageTable).where(eq(ScougiPageTable.id, input.id));
      await db.delete(ScougiTable).where(eq(ScougiTable.id, input.id));
    } catch (e) {
      console.error(e)
      throw new Error("Failed to delete scougi");
    }
  }),
  page: publicProcedure.input(z.object({ scougi_id: z.number(), page: z.number() })).query(async ({ input }) => {
    const page = await db.query.ScougiPageTable.findFirst({
      where: and(eq(ScougiPageTable.id, input.scougi_id), eq(ScougiPageTable.number, input.page))
    })

    if (!page) {
      throw new TRPCError({ message: "No page data found", code: "NOT_FOUND" });
    }
    return page;
  })
})
