import { validateRequest } from "@/lib/auth";
import db from "@/lib/db";

// year parameter is actually the scougi id
export async function POST(request: Request, { params }: { params: { year: string; trim: number; page: number } }): Promise<Response> {
  // TODO: remove when auth works
  // const { user } = await validateRequest();
  // if (!user) return new Response(null, { status: 401 });

  const data = await request.arrayBuffer();

  const scougi = await db.selectFrom("Scougi").selectAll().where("year", "=", params.year).where("trim", "=", Number(params.trim)).executeTakeFirst();

  if (!scougi) {
    return new Response(null, {
      status: 401,
    })
  }

  db.insertInto("ScougiPage").values({
    id: scougi.id,
    number: Number(params.year),
    data: Buffer.from(data)
  });

  return new Response(null, {
    status: 200,
  });
}
