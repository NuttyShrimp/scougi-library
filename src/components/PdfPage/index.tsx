import React, { FC, useContext, useEffect, useState } from "react";
import { useVhToPixel } from "../../hooks/useVhToPixel";
import { LoadPage } from "../LoadPage";
import { pdfjs, Document, Page } from "react-pdf";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { pageContext } from "../../lib/pageContext";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

declare interface PdfPageProps {
  page: number;
  shouldLoad: boolean;
  overrideId?: number;
  useOverride?: boolean;
  height: number;
}

export const PdfPage: FC<PdfPageProps> = ({ page, overrideId, shouldLoad, height }) => {
  const [rendered, setRendered] = useState(false);
  const pageWidth = useVhToPixel(height);
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
      {!rendered && <LoadPage />}
      <Document file={pagePDF} noData={""} loading={""} error={""}>
        <Page
          pageIndex={0}
          width={pageWidth}
          height={pageWidth * 1.414}
          onRenderSuccess={() => setRendered(true)}
          noData={""}
          loading={""}
          error={""}
        />
      </Document>
    </>
  );
};
