'use client'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const PageIndicator = ({ year, trim, page, totalPages}: { year: string; trim: number; page: number; totalPages: number}) => {
  const router = useRouter();

  const setPage = (newPage: number) => {
    router.push(`/scougi/${year}/${trim}/${newPage}`);
  };

  return (
  <div className="flex gap-2">
        <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronsLeft height={28} onClick={() => setPage(Math.max(0, page - 10))} />
        </p> 
        <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronLeft height={28} onClick={() => setPage(Math.max(0, page - 1))} />
        </p> 
        <p className="min-w-16 text-center">
          {page + 1} / {totalPages}
        </p>
        <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronRight height={28} onClick={() => setPage(Math.min(totalPages - 1, page + 1))} />
        </p>
      <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronsRight height={28} onClick={() => setPage(Math.min(totalPages - 1, page + 10))} />
        </p>
      </div>
  )
};