import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!session) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  await prisma?.user.update({
    where: { id },
    data: {
      approved: true,
    },
  });

  res.status(200).send({ success: true });
}
