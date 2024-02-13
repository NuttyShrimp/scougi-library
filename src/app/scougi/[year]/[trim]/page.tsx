import { PageFlipper } from "@/components/PageFlipper";
import { TrimesterNames } from "@/enums/trimesterNames";
import db from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { year: string; trim: number; } }) {
  return redirect(`/scougi/${params.year}/${params.trim}/1`);;
}
