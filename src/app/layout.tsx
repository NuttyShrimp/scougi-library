import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scougi - Scouts en Gidsen Asse",
  description: "Scougi verzameling voor scouts & gidsen Asse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.className} prose !max-w-full !w-screen min-h-screen flex flex-col justify-between`}>
        <main className='grow'>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
