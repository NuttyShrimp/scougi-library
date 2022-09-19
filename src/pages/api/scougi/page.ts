import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
// @ts-ignore
import gs from "gs";
import { readFileSync, writeFileSync } from "fs";
import * as os from "os";
import { log } from "next-axiom";
import path from "path";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "GET" && method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (method === "GET") {
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
  } else {
    const isProd = process.env.NODE_ENV === 'production'
    const { page:pageData, number, scougiId } = JSON.parse(req.body);
    const page = new Uint8Array(new Buffer(pageData))

    if (!req.headers['x-token'] || req.headers['x-token'] !== process.env.TOKEN) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    writeFileSync(`${isProd ? '/tmp' : os.tmpdir()}/scougi-page-${number}.pdf`, page);
    const pagePNG = await new Promise<Buffer>(response => {
      gs()
        .executablePath(path.join(process.cwd(), "data/ghostscript/bin/gs"))
        .option("-dQUIET")
        .option("-dPARANOIDSAFER")
        .batch()
        .nopause()
        .option("-dNOPROMPT")
        .device("png16m")
        .define("TextAlphaBits", 4)
        .define("GraphicsAlphaBits", 4)
        .option("-r96")
        .option(`-dFirstPage=${number + 1}`)
        .option(`-dLastPage=${number + 1}`)
        .output(`${isProd ? '/tmp' : os.tmpdir()}/scougi-page-${number}.png`)
        .input(`${isProd ? '/tmp' : os.tmpdir()}/scougi-page-${number}.pdf`)
        .exec((err: any, _: string, stdErr: any) => {
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
          const imageBuffer = readFileSync(`/tmp/scougi-page-${number}.png`);
          response(imageBuffer);
        });
    });
    log.info("created new scougi page", { scougiId: scougiId, pageNumber: number + 1 })
    await prisma.scougiPage.create({
      data: {
        number: number,
        id: scougiId,
        data: pagePNG,
      },
    });
    res.status(200).end()
  }
}
