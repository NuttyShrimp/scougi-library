import { eq } from "drizzle-orm";
import db from "../db";
import { protectedProcedure, router } from "../trpc";
import { userTable } from "$lib/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  allNonApproved: protectedProcedure.query(async () => {
    const users = await db.query.userTable.findMany({
      where: eq(userTable.approved, false)
    })

    return users
  }),
  approve: protectedProcedure.input(z.object({
    id: z.string(),
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user.approved) {
      throw new TRPCError({ message: "You need to be approved to do this", code: "FORBIDDEN" })
    }

    await db.update(userTable).set({
      approved: true
    }).where(eq(userTable.id, input.id))
  }),
})
