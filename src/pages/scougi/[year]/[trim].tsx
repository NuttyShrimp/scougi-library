import { Divider, Title, Center, Anchor, NumberInput, Group, Text, Tooltip } from "@mantine/core";
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
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useVwToPixel } from "src/hooks/useVwToPixel";
import Link from "next/link";

declare interface ScougiProps {
  scougi: Omit<DB.Scougi, "hidden">;
}

const ScougiPage = forwardRef<
  any,
  { pageNumber: number; currentPage: number; height: number; preload: number; scougiId: number }
>(({ pageNumber, currentPage, height, preload, scougiId }, ref) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(
      (currentPage <= pageNumber && currentPage + preload >= pageNumber) ||
        (currentPage >= pageNumber && currentPage - preload <= pageNumber)
    );
  }, [currentPage, pageNumber]);

  return (
    <div ref={ref}>
      {shouldRender && <PdfPage page={pageNumber} shouldLoad={shouldRender} height={height} overrideId={scougiId} />}
    </div>
  );
});

const ScougiDisplay: NextPage<ScougiProps> = props => {
  const { classes } = useStyles();
  const pageCtx = useContext(pageContext);
  const flipBook = useRef<any>();
  const [page, setPage] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [ref, { height }] = useMeasure();
  const minWidth = useVwToPixel(90);

  const onPage = (e: any) => {
    setPage(e.data);
  };

  const getPages = () => {
    const pages = [];
    for (let i = 0; i < props.scougi.pages; i++) {
      pages.push(
        <ScougiPage
          key={`page-${i}`}
          scougiId={props.scougi.id}
          pageNumber={i}
          currentPage={page}
          height={height}
          preload={isPortrait ? 1 : 3}
        />
      );
    }
    return pages;
  };

  const goToPage = (page: number | undefined) => {
    if (!page) return;
    page = Math.max(1, Math.min(props.scougi.pages, page));
    flipBook.current.pageFlip().turnToPage(page - 1);
    setPage(page - 1);
  };

  const downloadScougi = async () => {
    const pdfBlob = await fetch(`/api/scougi/download?id=${props.scougi.id}`, {
      method: "GET",
    }).then(res => res.blob());
    const url = window.URL.createObjectURL(pdfBlob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "scougi.pdf",
      style: "display:none",
    });
    document.body.appendChild(a);

    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  useEffect(() => {
    pageCtx.openScougi(props.scougi.id, props.scougi.updatedAt, props.scougi.pages);
    return () => pageCtx.openScougi(0, "", 0);
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
        {/*<Group position="apart">*/}
        {/*  <div>*/}
        <Link href="/">
          <Anchor>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Anchor>
        </Link>
        <span style={{ marginLeft: ".3vw" }}>
          Scougi - {props.scougi.year} - {TrimesterNames[props.scougi.trim ?? 0]}
        </span>
        {/*</div>*/}
        {/*<div>*/}
        {/*  <Tooltip label='Download'>*/}
        {/*    <Anchor onClick={downloadScougi}>*/}
        {/*      <FontAwesomeIcon icon={faFileArrowDown} />*/}
        {/*    </Anchor>*/}
        {/*  </Tooltip>*/}
        {/*</div>*/}
        {/*</Group>*/}
      </Title>
      <Divider mb={"md"} />
      <div className={classes.bookWrapper}>
        <div className={[classes.btn, "left"].join(" ")} onClick={() => flipBook.current.pageFlip().flipPrev()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className={isPortrait ? "" : classes.book} ref={ref}>
          <HTMLFlipBook
            showCover
            flippingTime={250}
            width={515}
            height={733}
            size={"stretch"}
            minWidth={minWidth < 515 ? minWidth : 280}
            minHeight={minWidth * 1.414 < 733 ? minWidth : 400}
            maxWidth={1000}
            maxHeight={1498}
            onFlip={onPage}
            ref={flipBook}
            mobileScrollSupport={false}
            usePortrait={true}
            // swipeDistance={isPortrait ? 15 : 30}
          >
            {getPages()}
          </HTMLFlipBook>
        </div>
        <div className={[classes.btn, "right"].join(" ")} onClick={() => flipBook.current.pageFlip().flipNext()}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
      <Center>
        <NumberInput
          value={page + 1}
          size="sm"
          hideControls
          onChange={goToPage}
          width="1vw"
          min={1}
          max={props.scougi.pages}
          step={isPortrait ? 1 : 2}
          parser={value => value && value.replace(/\/\d*/g, "")}
          formatter={value =>
            !Number.isNaN(value ? parseInt(value) : NaN) ? `${value}/${props.scougi.pages}` : `1/${props.scougi.pages}`
          }
          className={classes.pageInput}
        />
        {/*<p>/{props.scougi.pages}</p>*/}
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
