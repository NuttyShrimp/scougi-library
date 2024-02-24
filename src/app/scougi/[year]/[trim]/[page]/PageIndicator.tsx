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
    <div className="flex gap-2 not-prose mt-4">
      <p className={`btn btn-ghost btn-circle btn-sm ${page === 1 ? 'btn-disabled' : ''}`}>
        <ChevronsLeft height={28} onClick={() => pushPage(Math.max(1, page - 10))} />
      </p>
      <p className={`btn btn-ghost btn-circle btn-sm ${page === 1 ? 'btn-disabled' : ''}`}>
        <ChevronLeft height={28} onClick={() => pushPage(Math.max(1, page - 1))} />
      </p>
      <p className="min-w-16 text-center">
        <input
          className="w-8 px-0 text-center input input-sm input-bordered"
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
      <p className={`btn btn-ghost btn-circle btn-sm ${page === totalPages ? 'btn-disabled' : ''}`}>
        <ChevronRight height={28} onClick={() => pushPage(Math.min(totalPages, page + 1))} />
      </p>
      <p className={`btn btn-ghost btn-circle btn-sm ${page === totalPages ? 'btn-disabled' : ''}`}>
        <ChevronsRight height={28} onClick={() => pushPage(Math.min(totalPages, page + 10))} />
      </p>
    </div>
  )
};
