import { Divider, Title } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import prisma from "../../../lib/prisma";
import HTMLFlipBook from "react-pageflip";
import { useStyles } from "../../../styles/scougi.styles";
import { TrimesterNames } from "../../../enums/trimesterNames";
import { makeSerializable } from "../../../lib/util";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pageContext } from "../../../lib/pageContext";
import { useVhToPixel } from "../../../hooks/useVhToPixel";
import Head from "next/head";
import { PdfPage } from "../../../components/PdfPage";

declare interface ScougiProps {
  scougi: Omit<DB.Scougi, "hidden">;
}

const PAGE_HEIGHT = 65;

const ScougiPage = forwardRef<any, { pageNumber: number; currentPage: number }>(({ pageNumber, currentPage }, ref) => {
  const { classes } = useStyles();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(
      (currentPage <= pageNumber && currentPage + 3 >= pageNumber) ||
        (currentPage >= pageNumber && currentPage - 3 <= pageNumber)
    );
  }, [currentPage, pageNumber]);

  return (
    <div ref={ref} className={classes.page}>
      {shouldRender && <PdfPage page={pageNumber} shouldLoad={shouldRender} height={PAGE_HEIGHT} />}
    </div>
  );
});

const ScougiDisplay: NextPage<ScougiProps> = props => {
  const { classes } = useStyles();
  const pageCtx = useContext(pageContext);
  const flipBook = useRef<any>();
  const [page, setPage] = useState(0);
  const pageWidth = useVhToPixel(PAGE_HEIGHT);

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
    pageCtx.openScougi(props.scougi.id, props.scougi.updatedAt, props.scougi.pages);
  }, []);

  return (
    <div className={classes.wrapper}>
      <Head>
        <title>
          {TrimesterNames[props.scougi.trim ?? 0]} - {props.scougi.year} - Scouts en Gidsen Asse
        </title>
      </Head>
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

export const getServerSideProps: GetServerSideProps<{
  scougi: Omit<DB.Scougi, "hidden" | "updatedAt"> & {
    updatedAt: Date;
  };
}> = async ({ params }) => {
  if (!params?.trim || !params?.year || Array.isArray(params.year) || isNaN(Number(params.trim)))
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
      updatedAt: true,
      id: true,
    },
    where: {
      year: params.year,
      trim: Number(params.trim),
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
