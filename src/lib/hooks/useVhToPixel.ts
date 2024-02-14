'use client'
import { useEffect, useState } from 'react';
import { useWindowSize } from './useWindowSize';


export const vhToPixel = (vh: number): number => {
  if (typeof window === "undefined") {
    return 0;
  }
  return (vh * window.innerHeight) / 100;
};

export const useVhToPixel = (vh: number): number => {
  const [calcPx, setCalcPx] = useState(vhToPixel(vh));
  const size = useWindowSize();

  useEffect(() => {
    setCalcPx(vhToPixel(vh));
  }, [size, vh]);

  return calcPx;
};