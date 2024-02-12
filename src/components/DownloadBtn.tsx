'use client'

import { FileDownIcon } from "lucide-react"

export const DownloadBtn = (props: { data: Uint8Array }) => {
  return (
    <div className="flex gap-2 items-center cursor-pointer" onClick={() => {
      const blob = new Blob([new Uint8Array(props.data)], { type: "application/pdf" });
      var blobUrl = URL.createObjectURL(blob);
      window.location.replace(blobUrl);
    }}>
      <FileDownIcon />
      <span className="font-bold">
        Download
      </span>
    </div>
  )
}