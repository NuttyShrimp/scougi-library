'use client'

import { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive"

export const HTMLProvider = ({ children }: PropsWithChildren<unknown>) => {
  const darkMode = useMediaQuery({
    query: "(prefers-color-scheme: dark)"
  });

  return (
    <html lang='nl' data-theme={darkMode ? "dark" : "light"}>
      {children}
    </html>
  )
}
