"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo, useState } from "react";

export const PageFlipper = (props: { pages: JSX.Element[]}) => {
  const [page, setPage] = useState(0);
  const selectedPage = useMemo(() => props.pages[page], [page, props.pages]);

  return (
    <div className="flex flex-col items-center">
      <div className="py-4 h-[80vh] sm:w-[80vw] w-[95vw] flex items-center justify-center">
        {selectedPage}
      </div>
      <div className="flex gap-2">
        <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronsLeft height={28} onClick={() => setPage(Math.max(0, page - 10))} />
        </p> 
        <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronLeft height={28} onClick={() => setPage(Math.max(0, page - 1))} />
        </p> 
        <p className="min-w-16 text-center">
          {page + 1} / {props.pages.length}
        </p>
        <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronRight height={28} onClick={() => setPage(Math.min(props.pages.length - 1, page + 1))} />
        </p>
      <p className="cursor-pointer hover:bg-gray-300 rounded-full">
          <ChevronsRight height={28} onClick={() => setPage(Math.min(props.pages.length - 1, page + 10))} />
        </p>
      </div>
    </div>
  )
}