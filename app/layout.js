import { Chivo } from "next/font/google";
import "./globals.css";

import DitherCursorTrail from "./components/dither/dither-cursor-trail";

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
      className={`${chivo.variable} bg-s h-full antialiased noise`}
    >
      <body className="min-h-full cursor-default!">
        {children} <DitherCursorTrail />
      </body>
    </html>
  );
}
