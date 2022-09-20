import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { Readable } from "stream";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query
  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).send({ message: "missing data" })
  }

  const pages = await prisma?.scougiPdfPage.findMany({
    where: {
      id: Number(id),
    },
    orderBy: {
      number: 'asc'
    }
  })
  if (!pages) {
    return res.status(404).send({});
  }
  const mergedPDF = await PDFDocument.create();
  for (const pageData of pages) {
    const pagePDF = await PDFDocument.load(new Uint8Array(pageData.data));
    const [page] = await mergedPDF.copyPages(pagePDF, [0]);
    mergedPDF.addPage(page)
  }

  const pdfBuffer = Buffer.from(await mergedPDF.save())

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': pdfBuffer.byteLength,
    'Content-Disposition': "attachment; filename=scougi.pdf"
  })

  const pdfStream = Readable.from(pdfBuffer)
  await new Promise(function (resolve) {
    pdfStream.pipe(res)
    pdfStream.on('end', resolve)
  })
}
