import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  redirect(302, `/scougi/${params.year}/${params.trim}?page=${params.nr}`)
}
