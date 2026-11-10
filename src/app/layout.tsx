import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { rootMetadata, defaultViewport } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('kimziz-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" && <Analytics />}
      </body>
    </html>
  );
}
