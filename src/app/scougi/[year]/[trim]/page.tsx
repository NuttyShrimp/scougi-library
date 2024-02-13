import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { year: string; trim: number; } }) {
  return redirect(`/scougi/${params.year}/${params.trim}/1`);;
}
