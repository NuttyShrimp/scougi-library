'use client'
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ScougiPage from "./ScougiPage";

export const MovablePage = (props: { data: string; scaleOverwrite?: number }) => {
  return (
    <TransformWrapper
      wheel={{
        smoothStep: 0.001,
        step: 0.2,
      }}
      pinch={{
        step: 5
      }}
    >
      <TransformComponent
        wrapperClass="flex items-baseline !overflow-visible cursor-zoom-in"
      >
        <ScougiPage {...props} />
      </TransformComponent>
    </TransformWrapper>
  )
}
