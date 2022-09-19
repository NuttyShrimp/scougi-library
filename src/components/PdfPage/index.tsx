import React, { FC, useContext, useEffect, useState } from "react";
import { LoadPage } from "../LoadPage";
import { pageContext } from "../../lib/pageContext";
import styles from '../../styles/pdfPage.module.scss';

declare interface PdfPageProps {
  page: number;
  shouldLoad: boolean;
  overrideId?: number;
  height: number;
}

export const PdfPage: FC<PdfPageProps> = ({ page, overrideId, shouldLoad, height }) => {
  const [rendered, setRendered] = useState(false);
  const [pagePDF, setPagePDF] = useState<string>();
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
      <div className={styles.page} style={{ display: rendered ? "block" : "none", height, width: height/1.414 }}>
        <img src={pagePDF} alt={`scougi page ${page}`} onLoad={() => setRendered(true)} />
      </div>
    </>
  );
};
