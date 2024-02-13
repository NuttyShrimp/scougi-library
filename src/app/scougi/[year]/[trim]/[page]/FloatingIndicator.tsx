'use client'

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation";

export const FloatingIndicator = ({ year, trim, page, totalPages }: { year: string; trim: number; page: number; totalPages: number }) => {
  const router = useRouter();

  const changePage = (modifier: number) => {
    const newPage = Math.min(Math.max(1, page + modifier), totalPages);
    router.push(`/scougi/${year}/${trim}/${newPage}`);
  }
  return (
    <>
      <div className="opacity-0 md:hover:opacity-25 absolute left-0 top-0 w-12 h-[80vh] bg-gray-300 flex items-center justify-center cursor-pointer" onClick={() => changePage(-1)}>
        <ChevronLeft />
      </div>
      <div className="opacity-0 md:hover:opacity-25 absolute right-0 top-0 w-12 h-[80vh] bg-gray-300 flex items-center justify-center cursor-pointer" onClick={() => changePage(1)}>
        <ChevronRight />
      </div>
    </>
  )
}