import {
  Divider,
  Title,
  Center,
  Anchor,
  NumberInput,
  Group,
  Text,
  Stack,
  SegmentedControl,
  Loader,
  Flex,
  Alert,
} from "@mantine/core";
import { NextPage } from "next";
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { useStyles } from "../../../styles/scougi.styles";
import { TrimesterNames } from "../../../enums/trimesterNames";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pageContext } from "../../../lib/pageContext";
import Head from "next/head";
import { PdfPage } from "../../../components/PdfPage";
import useMeasure from "react-use-measure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { faArrowLeft, faChevronLeft, faChevronRight, faCircleInfo, faFileArrowDown, faX } from "@fortawesome/free-solid-svg-icons";
import { useVwToPixel } from "src/hooks/useVwToPixel";
import Link from "next/link";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import HTMLFlipBook from "react-pageflip";

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

const ScougiDisplay: NextPage = () => {
  const router = useRouter();
  const { error, isLoading, data } = useQuery<ScougiProps>("/api/scougi/entry", () => {
    return fetch(`/api/scougi/entry?trim=${router.query.trim}&year=${router.query.year}`).then(res => res.json())
  }, {
    enabled: !!router.query.trim && !!router.query.year
  })
  const { classes } = useStyles();
  const pageCtx = useContext(pageContext);
  const flipBook = useRef<any>();
  const [page, setPage] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [disablePadding, setDisablePadding] = useState(true);
  const [mode, setMode] = useState<"scroll" | "zoom">("scroll");
  const [ref, { height }] = useMeasure();
  const minWidth = useVwToPixel(90);

  const onPage = (e: any) => {
    setPage(e.data);
  };

  const getPages = () => {
    const pages: JSX.Element[] = [];
    if (!data?.scougi?.pages) return pages;
    for (let i = 0; i < data.scougi.pages; i++) {
      pages.push(
        <ScougiPage
          key={`page-${i}`}
          scougiId={data.scougi.id}
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
    if (!data?.scougi?.pages) return;
    page = Math.max(1, Math.min(data.scougi.pages, page));
    flipBook.current.pageFlip().turnToPage(page - 1);
    setPage(page - 1);
  };

  const checkZoom = (ref: ReactZoomPanPinchRef) => {
    setDisablePadding(ref.state.scale <= 1);
  };

  useEffect(() => {
    if (data) {
      pageCtx.openScougi(data.scougi.id, data.scougi.updatedAt, data.scougi.pages);
    }
    return () => pageCtx.openScougi(0, "", 0);
  }, []);

  useEffect(() => {
    // if (flipBook.current) {
    //   setIsPortrait(flipBook.current.pageFlip()?.render?.orientation === "portrait");
    // }
    setIsPortrait(minWidth < 515);
  }, [flipBook.current, minWidth]);

  if (isLoading || !data) {
    return (
      <div>
        <Center>
          <Stack>
            <Center>
              <Loader />
            </Center>
            <Text>Loading scougi...</Text>
          </Stack>
        </Center>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Center>
          <Stack>
            <Center>
              <FontAwesomeIcon icon={faX} style={{
                fontSize: '1.5rem',
                color: "#ff0000",
              }
              } />
            </Center>
            <Text>Failed to load scougi :(</Text>
          </Stack>
        </Center>
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <Head>
        <title>
          {TrimesterNames[data.scougi.trim ?? 0]} - {data.scougi.year} - Scouts en Gidsen Asse
        </title>
      </Head>
      <Title order={4}>
        <Group position="apart">
          <div>
            <Link href="/">
              <Anchor>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Anchor>
            </Link>
            <span style={{ marginLeft: ".3vw" }}>
              Scougi - {data.scougi.year} - {TrimesterNames[data.scougi.trim ?? 0]}
            </span>
          </div>
          <div>
            <Anchor href={data.scougi.preview} target={"_blank"}>
              <Flex>
                <Text color={"white"} pr={5}>Downloaden</Text><FontAwesomeIcon icon={faFileArrowDown} />
              </Flex>
            </Anchor>
          </div>
        </Group>
      </Title>
      <Divider mb={"xs"} />
      <Alert icon={<FontAwesomeIcon icon={faCircleInfo}/>} color="blue" mb={"xs"}>
        Wil je inzoomen, op de links klikken of gewoon weg de pdf downloaden? Gebruik de knop in de rechter boven hoek
      </Alert>
      <div className={classes.bookWrapper}>
        <div className={[classes.btn, "left"].join(" ")} onClick={() => flipBook.current.pageFlip().flipPrev()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        {isPortrait ? (
          <div ref={ref}>
            <TransformWrapper
              panning={{
                disabled: !isPortrait || disablePadding,
                velocityDisabled: true,
              }}
              wheel={{
                disabled: !isPortrait || mode === "scroll",
              }}
              doubleClick={{
                disabled: true,
              }}
              centerZoomedOut
              onZoom={checkZoom}
              onPinching={checkZoom}
            >
              <TransformComponent>
                <div style={{ pointerEvents: mode === "scroll" ? "all" : "none" }}>
                  <HTMLFlipBook
                    showCover
                    flippingTime={250}
                    width={515}
                    height={734}
                    size={"stretch"}
                    minWidth={minWidth < 515 ? minWidth : 280}
                    minHeight={minWidth * 1.414 < 733 ? minWidth : 400}
                    maxWidth={1000}
                    maxHeight={1498}
                    onFlip={onPage}
                    ref={flipBook}
                    mobileScrollSupport={false}
                    usePortrait={isPortrait}
                    swipeDistance={30}
                  >
                    {getPages()}
                  </HTMLFlipBook>
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
        ) : (
          <div className={classes.book} ref={ref}>
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
              usePortrait={isPortrait}
              swipeDistance={30}
            >
              {getPages()}
            </HTMLFlipBook>
          </div>
        )}
        <div className={[classes.btn, "right"].join(" ")} onClick={() => flipBook.current.pageFlip().flipNext()}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
      <Center>
        <Stack spacing={"xs"}>
          <NumberInput
            value={page + 1}
            size="sm"
            hideControls
            onChange={goToPage}
            width="1vw"
            min={1}
            max={data.scougi.pages}
            step={isPortrait ? 1 : 2}
            parser={value => value && value.replace(/\/\d*/g, "")}
            formatter={value =>
              !Number.isNaN(value ? parseInt(value) : NaN)
                ? `${value}/${data.scougi.pages}`
                : `1/${data.scougi.pages}`
            }
            inputMode={"numeric"}
            variant={"unstyled"}
            className={classes.pageInput}
          />
          {isPortrait && (
            <SegmentedControl
              value={mode}
              onChange={val => setMode(val as "scroll" | "zoom")}
              data={[
                { label: "Scroll", value: "scroll" },
                { label: "Zoom", value: "zoom" },
              ]}
            />
          )}
        </Stack>
      </Center>
    </div>
  );
};

export default ScougiDisplay;
