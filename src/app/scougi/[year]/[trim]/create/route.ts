import { validateRequest } from "@/lib/auth"
import db from "@/lib/db";
import { ScougiTable } from "@/lib/db/schema";

export const POST = async (request: Request, { params }: { params: { year: string; trim: number } }) => {
  const { user } = await validateRequest();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const body = await request.json();

  const result = await db.insert(ScougiTable).values({
    trim: Number(params.trim),
    year: params.year,
    pages: body.pages,
    hidden: false,
  })

  if (result?.rowsAffected < 1) {
    return Response.json({ message: "Failed to save scougi in database" }, {
      status: 500
    })
  }
  if (result?.insertId === undefined) {
    return Response.json({ message: "Failed to save scougi in database (insertId)" }, {
      status: 500
    })
  };

  return new Response(null, {
    status: 200
  })
}
