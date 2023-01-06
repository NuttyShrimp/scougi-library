import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../lib/prisma";
import db from '../../../lib/kysely';
// @ts-ignore
import gs from "gs";
import { readFileSync, writeFileSync } from "fs";
import * as os from "os";
import path from "path";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}

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

    const pageData = await db.selectFrom("ScougiPage").select(["data"]).where("number", "=", Number(page)).where("id", "=", Number(id)).executeTakeFirst();
    if (!pageData?.data) {
      return res.status(404).send({});
    }

    const pageu8Arr = new Uint8Array(atob(pageData.data).split("").map(function(c) {
    return c.charCodeAt(0); }));

    res.status(200).setHeader("Content-Type", "image/png").send(Buffer.from(pageu8Arr));
  } else {
    const isProd = process.env.NODE_ENV === "production";
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session.user?.approved) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    const { pageNumber, scougiId } = JSON.parse(req.body);
    const pageData = await db.selectFrom("ScougiPdfPage").selectAll().where("id", "=", scougiId).where("number", "=", pageNumber).executeTakeFirst();
    if (pageData === undefined || pageData?.data === undefined) {
      res.status(400).send("missing data entry from body")
      return;
    }
    const page = new Uint8Array(atob(pageData.data).split("").map(function(c) {
    return c.charCodeAt(0); }));

    writeFileSync(`${isProd ? "/tmp" : os.tmpdir()}/scougi-page-${pageNumber}.pdf`, page);
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
        .option(`-dFirstPage=1`)
        .option(`-dLastPage=1`)
        .output(`${isProd ? "/tmp" : os.tmpdir()}/scougi-page-${pageNumber}.png`)
        .input(`${isProd ? "/tmp" : os.tmpdir()}/scougi-page-${pageNumber}.pdf`)
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
          const imageBuffer = readFileSync(`/tmp/scougi-page-${pageNumber}.png`);
          response(imageBuffer);
        });
    });
    await db.insertInto("ScougiPage").values({
      number: pageNumber,
      id: scougiId,
      data: Buffer.from(pagePNG).toString("base64"),
    }).execute();
    res.status(200).end();
  }
}
