import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

/* ─── FONT SETUP ────────────────────────────────────────────────
   Setiap font diinject sebagai CSS variable ke dalam globals.css:
     --font-sans    → body, input, prose
     --font-display → h1–h6 (Bebas Neue)
     --font-mono    → label, badge, btn, code
   ─────────────────────────────────────────────────────────────── */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sandzh — Portfolio",
  description: "Video Editor, Graphic Designer, and 3D VFX Artist.",
  icons: {
    icon: [
      { url: "/SB.png", media: "(prefers-color-scheme: light)" },
      { url: "/SW.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Inject tema sebelum render — cegah FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${spaceMono.variable} antialiased`}
      >
        {/* Film grain overlay — layer noise di atas semua konten */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
