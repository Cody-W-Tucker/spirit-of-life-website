import "@workspace/ui/globals.css";

import { Geist_Mono, Lato } from "next/font/google";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { VisualEditingWrapper } from "@/components/visual-editing";
import { SanityLive } from "@/lib/sanity/live";

import { Analytics } from "@vercel/analytics/next";

import { Providers } from "../components/providers";

const fontLato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
  display: "optional",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "optional",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  const draftModeEnabled = (await draftMode()).isEnabled;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontLato.variable} ${fontMono.variable} font-lato font-normal antialiased`}
      >
        <Providers>
          <Suspense fallback={<NavbarSkeleton />}>
            <NavbarServer />
          </Suspense>
          {children}

          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          {draftModeEnabled && <PreviewBar />}
          {draftModeEnabled && <VisualEditingWrapper />}
        </Providers>
        <SanityLive />
        <Analytics />
      </body>
    </html>
  );
}
