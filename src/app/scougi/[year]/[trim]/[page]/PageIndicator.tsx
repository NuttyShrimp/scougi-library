'use client'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const PageIndicator = ({ year, trim, page, totalPages }: { year: string; trim: number; page: number; totalPages: number }) => {
  const router = useRouter();
  const [pageValue, setPage] = useState(page);

  const pushPage = (newPage: number) => {
    router.push(`/scougi/${year}/${trim}/${newPage}`);
  };

  const updatePageFromInput = () => {
    const newPage = Math.max(0, Math.min(totalPages, pageValue));
    setPage(newPage);
    pushPage(newPage);
  }

  return (
    <div className="flex gap-2">
      <p className="cursor-pointer hover:bg-gray-300 rounded-full w-8 flex items-center justify-center">
        <ChevronsLeft height={28} onClick={() => pushPage(Math.max(1, page - 10))} />
      </p>
      <p className="cursor-pointer hover:bg-gray-300 rounded-full w-8 flex items-center justify-center">
        <ChevronLeft height={28} onClick={() => pushPage(Math.max(1, page - 1))} />
      </p>
      <p className="min-w-16 text-center">
        <input
          className="w-8 px-0 text-center input input-sm"
          value={pageValue}
          onChange={e => setPage(Number(e.currentTarget.value))}
          onKeyUp={e => {
            if (e.key === "Enter") {
              updatePageFromInput();
            }
          }}
          onBlur={updatePageFromInput}
        /> / {totalPages}
      </p>
      <p className="cursor-pointer hover:bg-gray-300 rounded-full w-8 flex items-center justify-center">
        <ChevronRight height={28} onClick={() => pushPage(Math.min(totalPages, page + 1))} />
      </p>
      <p className="cursor-pointer hover:bg-gray-300 rounded-full w-8 flex items-center justify-center">
        <ChevronsRight height={28} onClick={() => pushPage(Math.min(totalPages, page + 10))} />
      </p>
    </div>
  )
};