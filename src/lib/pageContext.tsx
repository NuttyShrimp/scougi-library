import { createContext, FC, PropsWithChildren, useState } from "react";

interface PageContext {
  pages: Map<number, Uint8Array>;
  id: number;
  getPage: (pageNum: number) => Promise<Uint8Array>;
  openScougi: (id: number) => void;
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
  const [pages, setPages] = useState<Map<number, Uint8Array>>(new Map());
  const [id, setId] = useState(0);

  const getPage = async (pageNum: number) => {
    if (pages.has(pageNum)) {
      return pages.get(pageNum);
    }
    const pageRes = await fetch(`/api/scougi/page?id=${id}&page=${pageNum}`, {
      method: "GET",
    }).then(res => res.json());
    return pageRes.page;
  };

  const openScougi = (scougiId: number) => {
    if (scougiId === id) return;
    setId(scougiId);
    setPages(new Map());
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
