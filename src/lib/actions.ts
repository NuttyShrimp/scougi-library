"use server";

import { revalidatePath } from "next/cache";
import db from "./db";

export const deleteScougi = async (id: number) => {
  try {
    await db.deleteFrom("ScougiPage").where("id", "=", id).execute();
    await db.deleteFrom("Scougi").where("id", "=", id).execute();
  } catch (e) {

    console.error(e)
  }
  revalidatePath('/admin')
}
