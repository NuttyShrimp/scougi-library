import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";
import { makeSerializable } from "src/lib/util";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {approved} = req.query;

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
  
  const users = await prisma.user.findMany({
    where: { approved: Boolean(approved ?? true) },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  res.status(200).send(makeSerializable(users));
}
