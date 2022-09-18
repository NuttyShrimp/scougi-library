import React, { FC, useEffect, useRef } from "react";
import { Group, Stack, Title, Text, Center, Container } from "@mantine/core";
import { PdfPage } from "../PdfPage";
import { TrimesterNames } from "../../enums/trimesterNames";
import Link from "next/link";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import styles from "../../styles/shelf.module.scss";
import { useVhToPixel } from "../../hooks/useVhToPixel";

const ShelfEntry: FC<{ year: string; trim: number; id: number }> = ({ year, trim, id }) => {
  const domTarget = useRef<HTMLDivElement | null>(null);
  const pageHeight = useVhToPixel(20);

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
    };
  }, []);

  const [{ rotateX, rotateY, rotateZ, scale }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    config: { mass: 5, tension: 450, friction: 40 },
  }));

  useGesture(
    {
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        api({
          rotateX: calcX(py),
          rotateY: calcY(px),
          scale: 1.1,
        }),
      onHover: ({ hovering }) => !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { domTarget, eventOptions: { passive: false } }
  );

  const calcX = (y: number) => {
    const rect = domTarget.current?.getBoundingClientRect();
    return -(y - (rect?.top ?? 0) - (rect?.height ?? 0) / 2 - window.pageYOffset) / 15;
  };
  const calcY = (x: number) => {
    const rect = domTarget.current?.getBoundingClientRect();
    return (x - (rect?.left ?? 0) - (rect?.width ?? 0) / 2 - window.pageXOffset) / 15;
  };

  return (
    <Link href={`/scougi/${year}/${trim}`}>
      <Stack spacing={"xs"} className={"clickable"}>
        <animated.div
          ref={domTarget}
          style={{
            transform: "perspective(600px)",
            scale,
            rotateX,
            rotateY,
            rotateZ,
          }}
        >
          <PdfPage page={0} shouldLoad height={pageHeight} overrideId={id} />
        </animated.div>
        <Center>
          <Text size={"md"} weight={"bolder"}>
            {TrimesterNames[trim]}
          </Text>
        </Center>
      </Stack>
    </Link>
  );
};

// Array is trims with published books
// Card hove animation comes from official
// examples from react-spring site
export const YearShelf: FC<{ year: string; trims: number[] }> = props => {
  return (
    <Container>
      <Center>
        <Title order={3} mb={"xs"}>
          {props.year}
        </Title>
      </Center>
      <Group position={"left"}>
        {props.trims
          .map((id, trim) => (id ? <ShelfEntry key={id} year={props.year} id={id} trim={trim} /> : null))
          .filter(t => t)}
      </Group>
      <div className={styles.plank}></div>
    </Container>
  );
};
