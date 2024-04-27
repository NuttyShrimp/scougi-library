"use server";

import { revalidatePath } from "next/cache";
import db from "./db";
import { ScougiPageTable, ScougiTable } from "./db/schema";
import { eq } from "drizzle-orm";

export const deleteScougi = async (id: number) => {
  try {
    await db.delete(ScougiPageTable).where(eq(ScougiPageTable.id, id));
    await db.delete(ScougiTable).where(eq(ScougiTable.id, id));
  } catch (e) {

    console.error(e)
  }
  revalidatePath('/')
}

export const finishScougiUpload = async () => {
  revalidatePath('/')
}
