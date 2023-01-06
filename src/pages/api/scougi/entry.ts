import { NextApiRequest, NextApiResponse } from "next";
import db from "src/lib/kysely";
import { makeSerializable } from "src/lib/util";
import { prisma } from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query?.trim || !req.query?.year || Array.isArray(req.query.year) || isNaN(Number(req.query.trim))) {
    res.status(404).json({
      scougi: { year: "", trim: "", pages: 0 },
    })
    return;
  }
  
  const scougi = await db.selectFrom("Scougi").select(["year", "trim", "pages", "preview", "updatedAt", "id"]).where("year", "=", req.query.year).where("trim", "=", Number(req.query.trim)).executeTakeFirst();
  if (!scougi) {
    res.status(404).json({});
    return;
  }
  res.status(200).json({
    scougi: makeSerializable(scougi),
  })
}
