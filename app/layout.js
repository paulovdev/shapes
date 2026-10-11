import "./globals.css";

import CustomCursor from "./components/common/custom-cursor";

export const metadata = {
  title: "shapes® — archive 2026",
  description: "archive 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`  bg-s h-full antialiased noise`}>
      <body className="min-h-full cursor-default!  ">
        <CustomCursor />

        {children}
      </body>
    </html>
  );
}
