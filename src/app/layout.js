// src/app/layout.js

import { Montserrat, Open_Sans } from "next/font/google";

import "./globals.css";

/* --------------------------------------------------
   Application Fonts
-------------------------------------------------- */

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata = {
  title: "Rapid Fire Math",
  description: "Improve your mental math speed with timed arithmetic drills.",
};

/* --------------------------------------------------
   Root Application Layout
-------------------------------------------------- */

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${montserrat.variable} ${openSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
