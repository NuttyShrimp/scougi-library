import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.body;
  const session = await getSession({ req })

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return;
  }

  if (!session) {
    res.status(401).send({ message: 'Unauthorized' })
    return;
  }

  await prisma?.user.update({
    where: { id },
    data: {
      approved: false 
    }
  })

  res.status(200).send({ success: true })
}
