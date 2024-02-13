'use client'
import { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive";

export const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const darkMode = useMediaQuery({
    query: "(prefers-color-scheme: dark)"
  });

  return (
    <div data-theme={darkMode ? "dark" : "light"}>
      {children}
    </div>
  )
}