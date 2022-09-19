import { Blob } from "buffer";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const { id, page } = req.query;

  if (!id || page === undefined || isNaN(Number(id)) || isNaN(Number(page))) {
    res.status(400).send({ message: "Missing data" });
    return;
  }

  const pageData = await prisma.scougiPage.findFirst({
    select: {
      data: true,
    },
    where: { number: Number(page), id: Number(id) },
  });
  if (!pageData?.data) {
    return res.status(404).send({});
  }

  res.status(200).send(pageData?.data);
}
