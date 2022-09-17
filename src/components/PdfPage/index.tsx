import React, { FC, useContext, useEffect, useState } from "react";
import { LoadPage } from "../LoadPage";
import { pdfjs, Document, Page } from "react-pdf";
// @ts-ignore
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker";
import { pageContext } from "../../lib/pageContext";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

declare interface PdfPageProps {
  page: number;
  shouldLoad: boolean;
  overrideId?: number;
  height: number;
}

export const PdfPage: FC<PdfPageProps> = ({ page, overrideId, shouldLoad, height }) => {
  const [rendered, setRendered] = useState(false);
  const [pagePDF, setPagePDF] = useState<Uint8Array>();
  const pageCtx = useContext(pageContext);

  const loadPage = async () => {
    if (pagePDF) return;
    setPagePDF(await pageCtx.getPage(page, overrideId));
  };

  useEffect(() => {
    if (shouldLoad) {
      loadPage();
    }
  }, [shouldLoad]);
  return (
    <>
      {!rendered && <LoadPage height={height} />}
      <div style={{ display: rendered ? "block" : "none" }}>
        <Document file={pagePDF} noData={""} loading={""} error={""}>
          <Page
            pageIndex={0}
            width={height / 1.414}
            height={height}
            onRenderSuccess={() => setRendered(true)}
            noData={""}
            loading={""}
            error={""}
          />
        </Document>
      </div>
    </>
  );
};
