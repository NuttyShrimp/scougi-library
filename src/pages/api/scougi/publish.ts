import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { PDFDocument } from "pdf-lib";
import asyncBatch from "async-batch";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
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

  const previewURL = new URL(url);
  const previewSearchParams = previewURL.searchParams;
  previewSearchParams.set("dl", "1");
  previewURL.search = previewSearchParams.toString();

  const masterPDFBytes = await fetch(previewURL.toString(), {
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
      preview: url,
    },
  });

  await asyncBatch(
    Array.from({ length: pageCount }),
    async (_: any, i: number) => {
      const pagePDF = await PDFDocument.create();
      const [page] = await pagePDF.copyPages(masterPDF, [i]);
      pagePDF.addPage(page);
      const pageData = await pagePDF.save();
      await prisma.scougiPdfPage.create({
        data: {
          id: scougi.id,
          data: Buffer.from(pageData),
          number: i,
        },
      });
    },
    5
  );
  // for (let i = 0; i < pageCount; i++) {
  //   const pagePDF = await PDFDocument.create();
  //   const [page] = await pagePDF.copyPages(masterPDF, [i]);
  //   pagePDF.addPage(page);
  //   const pageData = await pagePDF.save();
  //   await prisma.scougiPdfPage.create({
  //     data:{
  //       id: scougi.id,
  //       data: Buffer.from(pageData),
  //       number: i,
  //     }
  //   })
  // }

  res.status(200).send({ success: true, scougiId: scougi.id, pages: pageCount });
}
