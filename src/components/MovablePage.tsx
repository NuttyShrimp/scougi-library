"use client"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ScougiPage from "./ScougiPage";
import { ZoomControls } from "./ZoomControls";
import { useState } from "react";

export const MovablePage = (props: { data: string; scaleOverwrite?: number }) => {
  const [selecting, setSelecting] = useState(false)

  return (
    <TransformWrapper
      wheel={{
        smoothStep: 0.001,
        step: 0.2,
      }}
      pinch={{
        step: 5
      }}
      centerZoomedOut
      centerOnInit

      disabled={selecting}
    >
      <ZoomControls onSetSelecting={setSelecting} />
      <TransformComponent
        wrapperClass={"flex items-baseline !overflow-visible " + !selecting ? "cursor-zoom-in" : ""}
      >
        <ScougiPage {...props} />
      </TransformComponent>
    </TransformWrapper>
  )
}
