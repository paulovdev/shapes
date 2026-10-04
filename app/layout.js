import { Instrument_Sans, Chivo } from "next/font/google";
import "./globals.css";

import CustomCursor from "./components/common/custom-cursor";
 
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
});

export const metadata = {
  title: "shapes® — archive 2026",
  description: "archive 2026",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${chivo.variable} bg-s h-full antialiased noise`}
    >
      <body className="min-h-full cursor-default! noise">
        <CustomCursor />

        {children}
      </body>
    </html>
  );
}
