import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { log } from "next-axiom";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query;
  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).send({ message: "missing data" });
  }

  const pages = await prisma?.scougiPdfPage.findMany({
    where: {
      id: Number(id),
    },
    orderBy: {
      number: "asc",
    },
  });
  if (!pages) {
    return res.status(404).send({});
  }
  log.info("Started downloading process", { id });

  const mergedPDF = await PDFDocument.create();
  for (const pageData of pages) {
    const pagePDF = await PDFDocument.load(new Uint8Array(pageData.data));
    const [page] = await mergedPDF.copyPages(pagePDF, [0]);
    mergedPDF.addPage(page);
  }

  log.info("Successfully combined PDF", { id });
  const pdfBuffer = Buffer.from(await mergedPDF.save());

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=scougi.pdf");
  res.status(200).send(pdfBuffer);
}
