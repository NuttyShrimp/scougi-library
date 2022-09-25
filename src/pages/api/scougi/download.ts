import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { log } from "next-axiom";
import prisma from "../../../lib/prisma";
import { readFileSync, writeFileSync } from "fs";
import * as os from "os";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  log.info("Received unchecked download request");
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query;
  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).send({ message: "missing data" });
  }
  const logger = log.with({ handle: "download", id });
  logger.info("Received a download request");

  const pages = await prisma.scougiPdfPage.findMany({
    where: {
      id: Number(id),
    },
    orderBy: {
      number: "asc",
    },
  });
  if (!pages) {
    return res.status(404).send({ message: "No pages for scougi" });
  }
  logger.info("Started downloading process", { id });

  const mergedPDF = await PDFDocument.create();
  for (const pageData of pages) {
    const pagePDF = await PDFDocument.load(new Uint8Array(pageData.data));
    const [page] = await mergedPDF.copyPages(pagePDF, [0]);
    mergedPDF.addPage(page);
  }
  const pdfBytes = await mergedPDF.save();
  const isProd = process.env.NODE_ENV === "production";
  writeFileSync(`${isProd ? "/tmp" : os.tmpdir()}/scougi.pdf`, pdfBytes);

  log.info("Successfully combined PDF", { id });

  const pdfReadBuffer = readFileSync(`${isProd ? "/tmp" : os.tmpdir()}/scougi.pdf`);

  res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Disposition", "scougi.pdf");
  return res.end(pdfReadBuffer);
}
