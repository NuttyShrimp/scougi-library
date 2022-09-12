import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", [ "POST" ]);
    res.status(405).end(`Method ${ method } Not Allowed`);
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user?.approved) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const { id, toggle } = req.body;

  if (!id || toggle === undefined) {
    res.status(400).send({ message: "Missing data" });
    return;
  }

  await prisma.scougi.update({
      where: { id },
      data: {
        hidden: toggle,
      },
    },
  );

  res.status(200).send({ success: true });
}
