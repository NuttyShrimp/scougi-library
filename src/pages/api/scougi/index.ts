import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/kysely";
import { makeSerializable } from "../../../lib/util";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const scougis = await db.selectFrom("Scougi").select(['id', 'trim', "year"]).execute();
  const filteredScougis: Record<string, number[]> = {};
  scougis.forEach(s => {
    if (!filteredScougis[s.year]) {
      filteredScougis[s.year] = [];
    }
    filteredScougis[s.year][s.trim] = s.id;
  });

  res.setHeader("Cache-Control", "s-maxage=3600");
  res.status(200).send(makeSerializable(filteredScougis));
}
