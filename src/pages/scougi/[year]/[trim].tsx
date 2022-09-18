import { Divider, Title, Center } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import prisma from "../../../lib/prisma";
import HTMLFlipBook from "react-pageflip";
import { useStyles } from "../../../styles/scougi.styles";
import { TrimesterNames } from "../../../enums/trimesterNames";
import { makeSerializable } from "../../../lib/util";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pageContext } from "../../../lib/pageContext";
import Head from "next/head";
import { PdfPage } from "../../../components/PdfPage";
import useMeasure from "react-use-measure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

declare interface ScougiProps {
  scougi: Omit<DB.Scougi, "hidden">;
}

const ScougiPage = forwardRef<any, { pageNumber: number; currentPage: number; height: number; preload: number }>(
  ({ pageNumber, currentPage, height, preload }, ref) => {
    const { classes } = useStyles();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      setShouldRender(
        (currentPage <= pageNumber && currentPage + preload >= pageNumber) ||
          (currentPage >= pageNumber && currentPage - preload <= pageNumber)
      );
    }, [currentPage, pageNumber]);

    return (
      <div ref={ref} className={classes.page}>
        {shouldRender && <PdfPage page={pageNumber} shouldLoad={shouldRender} height={height} />}
      </div>
    );
  }
);

const ScougiDisplay: NextPage<ScougiProps> = props => {
  const { classes } = useStyles();
  const pageCtx = useContext(pageContext);
  const flipBook = useRef<any>();
  const [page, setPage] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [ref, { height }] = useMeasure();

  const onPage = (e: any) => {
    setPage(e.data);
  };

  const getPages = () => {
    const pages = [];
    for (let i = 0; i < props.scougi.pages; i++) {
      pages.push(
        <ScougiPage key={`page-${i}`} pageNumber={i} currentPage={page} height={height} preload={isPortrait ? 1 : 3} />
      );
    }
    return pages;
  };

  useEffect(() => {
    pageCtx.openScougi(props.scougi.id, props.scougi.updatedAt, props.scougi.pages);
  }, []);

  useEffect(() => {
    if (flipBook.current) {
      setIsPortrait(flipBook.current.pageFlip()?.render?.orientation === "portrait");
    }
  }, [flipBook.current]);

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
      <div className={classes.bookWrapper}>
        <div className={[classes.btn, "left"].join(" ")} onClick={() => flipBook.current.pageFlip().flipPrev()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className={isPortrait ? classes.mobileBook : classes.book} ref={ref}>
          <HTMLFlipBook
            showCover
            flippingTime={250}
            width={515}
            height={733}
            size={"stretch"}
            minWidth={280}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1498}
            onFlip={onPage}
            ref={flipBook}
            mobileScrollSupport={false}
            usePortrait={true}
            swipeDistance={isPortrait ? 15 : 30}
          >
            {getPages()}
          </HTMLFlipBook>
        </div>
        <div className={[classes.btn, "right"].join(" ")} onClick={() => flipBook.current.pageFlip().flipNext()}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
      <Center>
        <p>
          {page}/{props.scougi.pages}
        </p>
      </Center>
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
