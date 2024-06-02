"use client"
import { ZoomIn, ZoomOut, SquareDashedMousePointer } from "lucide-react";
import { useState } from "react";
import { useControls } from "react-zoom-pan-pinch";

export const ZoomControls = ({ onSetSelecting }: { onSetSelecting: (selecting: boolean) => void }) => {
  const [selecting, setSelecting] = useState(false)
  const { zoomIn, zoomOut } = useControls();

  return (
    <div className="join absolute top-0 z-10 mt-2">
      <button className="btn btn-sm btn-square join-item" onClick={() => zoomOut()}><ZoomOut /></button>
      <button className="btn btn-sm btn-square join-item" onClick={() => zoomIn()}><ZoomIn /></button>
      <button className={"btn btn-sm btn-square join-item " + (selecting ? "btn-active" : "")} onClick={() => {
        setSelecting(!selecting)
        onSetSelecting(!selecting)
      }}><SquareDashedMousePointer /></button>
    </div>
  )
}
