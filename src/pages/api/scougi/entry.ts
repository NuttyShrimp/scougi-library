import { NextApiRequest, NextApiResponse } from "next";
import { makeSerializable } from "src/lib/util";
import { prisma } from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query?.trim || !req.query?.year || Array.isArray(req.query.year) || isNaN(Number(req.query.trim))) {
    res.status(404).json({
      scougi: { year: "", trim: "", pages: 0 },
    })
    return;
  }

  const scougi = await prisma.scougi.findFirst({
    select: {
      year: true,
      trim: true,
      pages: true,
      updatedAt: true,
      id: true,
    },
    where: {
      year: req.query.year,
      trim: Number(req.query.trim),
    },
  });
  if (!scougi) {
    res.status(404).json({});
    return;
  }
  res.status(200).json({
    scougi: makeSerializable(scougi),
  })
}
