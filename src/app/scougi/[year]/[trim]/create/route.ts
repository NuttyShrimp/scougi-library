import { validateRequest } from "@/lib/auth"
import db from "@/lib/db";

export const POST = async (request: Request, { params }: { params: { year: string; trim: number } }) => {
  const { user } = await validateRequest();
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const body = await request.json();

  // @ts-expect-error id is default filled with auto-increment
  const scougi = await db.insertInto("Scougi").values({
    trim: Number(params.trim),
    year: params.year,
    pages: body.pages,
    preview: "",
    hidden: false,
    updatedAt: new Date(),
  }).executeTakeFirst();

  if (scougi?.numInsertedOrUpdatedRows === undefined || scougi?.numInsertedOrUpdatedRows < 1) {
    return Response.json({ message: "Failed to save scougi in database" }, {
      status: 500
    })
  }
  if (scougi?.insertId === undefined) {
    return Response.json({ message: "Failed to save scougi in database (insertId)" }, {
      status: 500
    })
  };

  return new Response(null, {
    status: 200
  })
}
