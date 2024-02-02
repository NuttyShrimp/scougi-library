import { PDFDocument } from "pdf-lib";

export const downloadFromDropbox = async (url: string): Promise<PDFDocument> => {
  const previewURL = new URL(url);
  // const previewSearchParams = previewURL.searchParams;
  // previewSearchParams.set("dl", "1");
  // previewURL.search = previewSearchParams.toString();

  const masterPDFBytes = await fetch(previewURL.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/pdf",
    },
  }).then(res => res.arrayBuffer());
  const masterPDF = await PDFDocument.load(masterPDFBytes);
  return masterPDF;
}

export const splitDocToPages = async (doc: PDFDocument): Promise<Uint8Array[]> => {
  const pageCount = doc.getPageCount();
  const pagesData: Uint8Array[] = [];
  for (let i = 0; i < pageCount; i++) {
    const pagePDF = await PDFDocument.create();
    const [page] = await pagePDF.copyPages(doc, [i]);
    pagePDF.addPage(page);
    const pageData = await pagePDF.save();
    pagesData.push(pageData);
  }
  return pagesData;
};

export const uploadPage = async (year: string, trim: number, pageNr: number, pdf: Uint8Array) => {
  const res = await fetch(`/scougi/${year}/${trim}/${pageNr}`, {
    method: "POST",
    body: pdf.buffer,
    headers: {
      "Content-Type": "application/pdf",
    }
  });
  if (!res.ok) {
    return false;
  }
  return true;
}
