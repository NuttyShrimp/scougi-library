import { createContext, FC, PropsWithChildren, useRef, useState } from "react";
import IndexedDb from "./dbservice";

interface PageContext {
  pages: Map<number, string>;
  id: number;
  getPage: (pageNum: number, IdOverride?: number) => Promise<string>;
  openScougi: (id: number, updatedAt: string, pageCount: number) => void;
}

export const pageContext = createContext<PageContext>({
  pages: new Map(),
  id: 0,
  getPage: async () => "",
  openScougi: () => null,
});


export const PageContextProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const idb = useRef<IndexedDb>();
  const [pages, setPages] = useState<Map<number, string>>(new Map());
  const [id, setId] = useState(0);

  const getPage = async (pageNum: number, scougiIdOverride?: number) => {
    if (pages.has(pageNum) && !scougiIdOverride) {
      return pages.get(pageNum)!;
    }
    if (scougiIdOverride && scougiIdOverride !== id) {
      const page = await idb.current?.getValue("pages", `${scougiIdOverride}-${pageNum}`);
      if (page) return (window.URL || window.webkitURL).createObjectURL(page as Blob);
    }
    const pageRes = await fetch(`/api/scougi/page?id=${scougiIdOverride ?? id}&page=${pageNum}`, {
      method: "GET",
    }).then(res => res.arrayBuffer());
    const pageBlob = new Blob([new Uint8Array(pageRes)], { type: "image/png" })
    const linkToBlob =(window.URL || window.webkitURL).createObjectURL(pageBlob) 
    if (scougiIdOverride && scougiIdOverride !== id) return linkToBlob;
    setPages(pages => {
      pages.set(pageNum, linkToBlob);
      return pages;
    });
    if (idb.current) {
      idb.current?.putValue("pages", pageBlob, `${id}-${pageNum}`);
    }
    return linkToBlob;
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
        const linkToBlob =(window.URL || window.webkitURL).createObjectURL(page as Blob)
        pages.set(i, linkToBlob);
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
