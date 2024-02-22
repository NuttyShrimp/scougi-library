import { validateRequest } from "@/lib/auth";
import db from "@/lib/db";
import { ScougiPageTable, ScougiTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request, { params }: { params: { year: string; trim: number; page: number } }): Promise<Response> {
  const { user } = await validateRequest();
  if (!user) return new Response(null, { status: 401 });

  const data = await request.text();

  const scougi = await db.query.ScougiTable.findFirst({
    where: and(
      eq(ScougiTable.year, params.year),
      eq(ScougiTable.trim, Number(params.trim)),
    )
  })

  if (!scougi) {
    return new Response(null, {
      status: 401,
    })
  }

  await db.insert(ScougiPageTable).values({
    id: scougi.id,
    number: Number(params.page),
    data,
  });

  return new Response(null, {
    status: 200,
  });
}
