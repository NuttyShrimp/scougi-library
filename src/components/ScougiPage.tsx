'use client'
import { disableScrollPlugin } from "@/lib/plugins/disableScroll";
import { ViewMode, Viewer, Worker } from "react-pdf-viewer/packages/core/src"
import 'react-pdf-viewer/packages/core/src/styles/index.scss';
import 'react-pdf-viewer/packages/zoom/src/styles/index.scss';
import "@/styles/scougiPage.scss";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { base64ToUint8Array } from "@/lib/pdf";

// currently not used, will be if all the pdf pages are in 1 file
const disableScrollPluginInstance = disableScrollPlugin();

const ScougiPage = (props: { data: string; scaleOverwrite?: number }) => {
  const isNotMobile = useMediaQuery({ query: '(min-width: 500px)' });
  const isTwoPage = useMediaQuery({ query: '(min-width: 640px)' });
  const viewerScale = useMemo(() => {
    if (props.scaleOverwrite) {
      return props.scaleOverwrite;
    }
    return isNotMobile ? 0.8 : 0.55
  }, [isNotMobile, props.scaleOverwrite]);
  const uintData = useMemo(() => base64ToUint8Array(props.data), [props.data]);
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="scougi-page w-full h-full">
        <Viewer fileUrl={uintData} viewMode={isTwoPage ? ViewMode.DualPageWithCover : ViewMode.SinglePage} defaultScale={viewerScale} plugins={[]} />
      </div>
    </Worker>
  )
}

export default ScougiPage