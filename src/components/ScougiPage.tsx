'use client'
import { useVhToPixel } from '@/lib/hooks/useVhToPixel';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};


const ScougiPage = (props: { data: string; height?: number; static?: boolean }) => {

  const defaultSize = useVhToPixel(80);
  const size = useWindowSize();
  const scale = useMemo(() => {
    let scaleModifier = props.static ? 1 : 1;
    if (size.width > 550) {
      return scaleModifier;
    }
    return (size.width / 550) * scaleModifier;
  }, [size, props.static]);

  return (
    <div style={{ scale: props.static ? 1 : 1 }}>
      <Document file={`data:application/pdf;base64,${props.data}`} options={options}>
        <Page pageNumber={1} height={props.height ?? defaultSize} scale={scale} renderAnnotationLayer />
      </Document>
    </div>
  )
}

export default ScougiPage
