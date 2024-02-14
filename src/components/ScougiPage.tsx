'use client'
import { useVhToPixel } from '@/lib/hooks/useVhToPixel';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};


const ScougiPage = (props: { data: string; height?: number }) => {
  const defaultSize = useVhToPixel(80);
  const size = useWindowSize();
  const scale = useMemo(() => {
    if (size.width > 550) {
      return 1;
    }
    return size.width / 550;
  }, [size]);

  return (
    <Document file={`data:application/pdf;base64,${props.data}`} options={options}>
      <Page pageNumber={1} height={props.height ?? defaultSize} scale={scale} />
    </Document>
  )
}

export default ScougiPage