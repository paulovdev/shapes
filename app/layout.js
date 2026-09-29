import { Chivo } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/common/custom-cursor";

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
});

export const metadata = {
  title: "shapes® — archive 2026",
  description:
    "Front-end developer & UX/UI design, specializing in creating immersive and intuitive user experiences, consistently pushing the boundaries of design innovation.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${chivo.variable} bg-s h-full antialiased noise`}
    >
      <body className="min-h-full">
        <CustomCursor />

        {children}
      </body>
    </html>
  );
}
