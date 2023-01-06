import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../lib/kysely";
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

  const scougi = await db.insertInto("Scougi").values({
    trim,
    year,
    pages: pageCount,
    preview: url,
    hidden: false,
    updatedAt: new Date(),
  }).executeTakeFirst();
  if (scougi?.numInsertedOrUpdatedRows === undefined || scougi?.numInsertedOrUpdatedRows <1) {
    res.status(500).send({ message: "Failed to save scougi in database" });
    return;
  } 
  if (scougi?.insertId === undefined) {
    res.status(500).send({ message: "Failed to save scougi in database (insertId)" });
    return;
  } 
  
  const pageGeneration = Array.from({ length: pageCount }).fill("0").map(
    async (_: any, i: number) => {
      const pagePDF = await PDFDocument.create();
      const [page] = await pagePDF.copyPages(masterPDF, [i]);
      pagePDF.addPage(page);
      const pageData = await pagePDF.save();
      await db.insertInto("ScougiPdfPage").values({
        id: Number(scougi.insertId),
        data: Buffer.from(pageData).toString("base64"),
        number: i,
      }).execute();
    }
  );
  await Promise.all(pageGeneration)

  res.status(200).send({ success: true, scougiId: Number(scougi.insertId), pages: pageCount });
}
