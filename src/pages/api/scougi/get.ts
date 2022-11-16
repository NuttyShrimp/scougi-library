import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  if (!session) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const today = new Date();
  const thisYear =
    today.getMonth() < 8
      ? `${today.getFullYear() - 1}-${today.getFullYear()}`
      : `${today.getFullYear()}-${today.getFullYear() + 1}`;
  const published = await prisma.scougi.findMany({
    select: {
      year: true,
      trim: true,
      id: true,
      hidden: true,
    },
    orderBy: [
      {
        year: "desc",
      },
      {
        trim: "desc",
      },
    ],
  });

  const years: Record<string, number[]> = {};
  published.forEach(s => {
    if (!years[s.year]) {
      years[s.year] = [0, 1, 2, 3];
    }
    years[s.year] = years[s.year].filter(t => t !== s.trim);
  });
  if (!years[thisYear]) {
    years[thisYear] = [0, 1, 2, 3];
  }
  
  res.status(200).json({
      years,
      currentYear: thisYear,
      published,
  })
}
