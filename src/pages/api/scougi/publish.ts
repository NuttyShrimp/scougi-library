import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { PDFDocument } from "pdf-lib";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const isProd = process.env.NODE_ENV === 'production'
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user?.approved) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const { trim, year, url, origin } = req.body;

  if (trim === undefined || !year || !url || !origin) {
    res.status(400).send({ message: "Missing data" });
    return;
  }

  const masterPDFBytes = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/pdf",
    },
  }).then(res => res.arrayBuffer());
  const masterPDF = await PDFDocument.load(masterPDFBytes);
  const pageCount = masterPDF.getPageCount();

  const scougi = await prisma.scougi.create({
    data: {
      trim,
      year,
      pages: pageCount,
    },
  });


  // TODO: move to batch process
  for (let i = 0; i < pageCount; i++) {
    const pagePDF = await PDFDocument.create();
    const [page] = await pagePDF.copyPages(masterPDF, [i]);
    pagePDF.addPage(page);
    const pageData = await pagePDF.save();
    fetch(`${origin}/api/scougi/page`, {
      method: "POST",
      body: JSON.stringify({
        page: Buffer.from(pageData),
        number: i,
        scougiId: scougi.id
      }),
      headers: {
        'x-token': process.env.TOKEN ?? ""
      }
    })
  }

  res.status(200).send({ success: true });
}
