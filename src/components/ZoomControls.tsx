"use client"
import { ZoomIn, ZoomOut } from "lucide-react";
import { useControls, useTransformContext } from "react-zoom-pan-pinch";

export const ZoomControls = () => {
  const ctx = useTransformContext();
  const { zoomIn, zoomOut } = useControls();
  return (
    <div className="join absolute top-0 z-10 mt-2">
      <button className="btn btn-sm btn-square join-item" onClick={() => zoomOut()}><ZoomOut /></button>
      <button className="btn btn-sm btn-square join-item" onClick={() => zoomIn()}><ZoomIn /></button>
    </div>
  )
}
