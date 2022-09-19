import { useCallback, useEffect, useState } from "react";

export const vwToPixel = (vw: number): number => {
  return (vw * window.innerWidth) / 100;
};

export const useVwToPixel = (vw: number): number => {
  const [calcPx, setCalcPx] = useState(1);

  const handleResize = useCallback(() => {
    setCalcPx(vwToPixel(vw));
  }, [vw]);

  useEffect(() => {
    setCalcPx(vwToPixel(vw));
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, vw]);

  return calcPx;
};
