import type { Metadata } from "next";
import { Space_Mono, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets:["latin"], variable:"--font-sans", weight:["400","500","600","700","800"] });
const spaceMono = Space_Mono({ subsets:["latin"], variable:"--font-mono", weight:["400","700"] });

export const metadata: Metadata = {
  title: "Sandy Fauzi — Portfolio",
  description: "Video Editor, Graphic Designer & 3D VFX Artist · Mahasiswa Fisika UNPAD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body className={`${syne.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}