import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { PDFDocument } from "pdf-lib";
// @ts-ignore
import gs from "gs";
import { readFileSync, writeFileSync } from "fs";
import * as os from "os";

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

  const { trim, year, url } = req.body;

  if (trim === undefined || !year || !url) {
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

  writeFileSync(`${isProd ? '/tmp' : os.tmpdir()}/scougi.pdf`, await masterPDF.save());

  const scougi = await prisma.scougi.create({
    data: {
      trim,
      year,
      pages: pageCount,
    },
  });

  try {
  // TODO: move to batch process
  for (let i = 0; i < pageCount; i++) {
    const pagePNG = await new Promise<Buffer>(response => {
      gs()
        .executablePath("gs")
        .option("-dQUIET")
        .option("-dPARANOIDSAFER")
        .batch()
        .nopause()
        .option("-dNOPROMPT")
        .device("png16m")
        .define("TextAlphaBits", 4)
        .define("GraphicsAlphaBits", 4)
        .option("-r96")
        .option(`-dFirstPage=${i + 1}`)
        .option(`-dLastPage=${i + 1}`)
        .output(`${isProd ? '/tmp' : os.tmpdir()}/scougi-page-${i}.png`)
        .input(`${isProd ? '/tmp' : os.tmpdir()}/scougi.pdf`)
        .exec((err: any, stdOut: string, stdErr: any) => {
          if (err) {
            console.error(err);
            res.status(400).send({ success: false });
            return;
          }
          if (stdErr) {
            console.error(stdErr);
            res.status(400).send({ success: false });
            return;
          }
          const imageBuffer = readFileSync(`/tmp/scougi-page-${i}.png`);
          response(imageBuffer);
        });
    });
    await prisma.scougiPage.create({
      data: {
        number: i,
        id: scougi.id,
        data: pagePNG,
      },
    });
  }

  res.status(200).send({ success: true });
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}
