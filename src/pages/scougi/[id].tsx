import { Divider, Title } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import prisma from "../../lib/prisma";
import { pdfjs, Document, Page } from "react-pdf";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import HTMLFlipBook from "react-pageflip";
import { useStyles } from "../../styles/scougi.styles";
import { TrimesterNames } from "../../enums/trimesterNames";
import { makeSerializable } from "../../lib/util";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pageContext } from "../../lib/pageContext";
import { useRouter } from "next/router";
import { LoadPage } from "../../components/LoadPage";
import { useVhToPixel } from "../../hooks/useVhToPixel";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

declare interface ScougiProps {
  scougi: Omit<DB.Scougi, "id" | "hidden">;
}

const ScougiPage = forwardRef<any, { pageNumber: number; currentPage: number }>(({ pageNumber, currentPage }, ref) => {
  const [pagePDF, setPagePDF] = useState<Uint8Array>();
  const pageCtx = useContext(pageContext);
  const pageWidth = useVhToPixel(57);

  const loadPage = async () => {
    if (pagePDF) return;
    setPagePDF(await pageCtx.getPage(pageNumber));
  };

  useEffect(() => {
    if (
      (currentPage <= pageNumber && currentPage + 5 >= pageNumber) ||
      (currentPage >= pageNumber && currentPage - 5 <= pageNumber)
    ) {
      loadPage();
    }
  }, [pageNumber, currentPage]);

  return (
    <div ref={ref}>
      <Document file={pagePDF} noData={<LoadPage />} loading={<LoadPage />} error={<LoadPage />}>
        <Page pageIndex={0} width={pageWidth} height={pageWidth * 1.414} />
      </Document>
    </div>
  );
});

const ScougiDisplay: NextPage<ScougiProps> = props => {
  const { classes } = useStyles();
  const pageCtx = useContext(pageContext);
  const router = useRouter();
  const flipBook = useRef<any>();
  const [page, setPage] = useState(0);
  const pageWidth = useVhToPixel(57);

  const { id } = router.query;

  const onPage = (e: any) => {
    setPage(e.data);
  };

  const getPages = () => {
    const pages = [];
    for (let i = 0; i < props.scougi.pages; i++) {
      pages.push(<ScougiPage key={`page-${i}`} pageNumber={i} currentPage={page} />);
    }
    return pages;
  };

  useEffect(() => {
    if (isNaN(Number(id))) {
      router.push("/");
      return;
    }
    pageCtx.openScougi(Number(router.query.id));
  }, []);

  return (
    <div className={classes.wrapper}>
      <Title order={4}>
        Scougi - {props.scougi.year} - {TrimesterNames[props.scougi.trim ?? 0]}
      </Title>
      <Divider mb={"md"} />
      <HTMLFlipBook
        showCover
        flippingTime={250}
        autoSize
        width={pageWidth}
        height={pageWidth * 1.414}
        onFlip={onPage}
        ref={flipBook}
      >
        {getPages()}
      </HTMLFlipBook>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ScougiProps> = async ({ params }) => {
  if (!params?.id || isNaN(Number(params.id)))
    return {
      props: {
        scougi: { year: "", trim: "", pages: 0 },
      },
      notFound: true,
    };
  const scougi = await prisma.scougi.findFirst({
    select: {
      year: true,
      trim: true,
      pages: true,
    },
    where: {
      id: Number(params.id),
    },
  });
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scougi: makeSerializable(scougi!),
    },
    notFound: !scougi,
  };
};

export default ScougiDisplay;
