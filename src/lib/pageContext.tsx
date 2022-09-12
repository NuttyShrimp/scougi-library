import { createContext, FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import IndexedDb from "./dbservice";
import { flushSync } from "react-dom";

interface PageContext {
  pages: Map<number, Uint8Array>;
  id: number;
  getPage: (pageNum: number) => Promise<Uint8Array>;
  openScougi: (id: number, updatedAt: string, pageCount: number) => void;
}

// TODO: Support multiple PDFs
// TODO: read-write to indexDB
export const pageContext = createContext<PageContext>({
  pages: new Map(),
  id: 0,
  getPage: async pageNum => new Uint8Array(),
  openScougi: id => null,
});

export const PageContextProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const idb = useRef<IndexedDb>();
  const [pages, setPages] = useState<Map<number, Uint8Array>>(new Map());
  const [id, setId] = useState(0);

  const getPage = async (pageNum: number) => {
    if (pages.has(pageNum)) {
      return pages.get(pageNum);
    }
    const pageRes = await fetch(`/api/scougi/page?id=${id}&page=${pageNum}`, {
      method: "GET",
    }).then(res => res.json());
    setPages(pages => {
      pages.set(pageNum, pageRes.page);
      return pages;
    });
    if (idb.current) {
      idb.current?.putValue("pages", pageRes.page, `${id}-${pageNum}`);
    }
    return pageRes.page;
  };

  const openScougi = async (scougiId: number, lastUpdate: string, pageCount: number) => {
    if (scougiId === id) return;
    setId(scougiId);
    await initDB();
    // Check metadata
    const scougiMetadata = await idb.current?.getValue<{ updatedAt: string; count: number }>("metadata", scougiId);
    if (!scougiMetadata) {
      setPages(new Map());
      await idb.current?.putValue("metadata", { updatedAt: lastUpdate, count: pageCount }, scougiId);
      return;
    }
    if (new Date(scougiMetadata.updatedAt).getTime() !== new Date(lastUpdate).getTime()) {
      setPages(new Map());
      // Clean cache
      for (let i = 0; i < pageCount; i++) {
        await idb.current?.deleteValue("pages", `${scougiId}-${i}`);
      }
      // Set new updated
      await idb.current?.putValue("metadata", { updatedAt: lastUpdate, count: pageCount }, scougiId);
      return;
    }
    const pages = new Map();
    for (let i = 0; i < pageCount; i++) {
      const page = await idb.current?.getValue("pages", `${scougiId}-${i}`);
      if (page) {
        pages.set(i, page);
      }
    }
    setPages(pages);
  };

  const initDB = async () => {
    if (!idb.current) {
      idb.current = new IndexedDb("scougi");
    }
    // pages is cache for pdf pages
    // metadata is id and timestamp to check if we have to invalidate cache
    await idb.current?.createObjectStore(["pages", "metadata"]);
  };

  return (
    <pageContext.Provider
      value={{
        pages,
        id,
        getPage,
        openScougi,
      }}
    >
      {children}
    </pageContext.Provider>
  );
};
