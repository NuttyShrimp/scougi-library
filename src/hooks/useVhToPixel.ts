import { useCallback, useEffect, useState } from "react";

export const vhToPixel = (vh: number): number => {
  return (vh * window.innerHeight) / 100;
};

export const useVhToPixel = (vh: number): number => {
  const [calcPx, setCalcPx] = useState(1);

  const handleResize = useCallback(() => {
    setCalcPx(vhToPixel(vh));
  }, [vh]);

  useEffect(() => {
    setCalcPx(vhToPixel(vh));
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, vh]);

  return calcPx;
};
