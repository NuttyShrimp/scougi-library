import { validateRequest } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: Request, { params }: { params: { year: string; trim: number; page: number } }): Promise<Response> {
  // TODO: remove when auth works
  // const { user } = await validateRequest();
  // if (!user) return new Response(null, { status: 401 });

  const data = await request.text();

  const scougi = await db.selectFrom("Scougi").selectAll().where("year", "=", params.year).where("trim", "=", Number(params.trim)).executeTakeFirst();

  if (!scougi) {
    return new Response(null, {
      status: 401,
    })
  }

  db.insertInto("ScougiPage").values({
    id: scougi.id,
    number: Number(params.page),
    data,
  }).execute();

  return new Response(null, {
    status: 200,
  });
}
