import Script from "next/script";
import { config } from "@/data/config";

// NEXT_PUBLIC_GA_ID overrides the id in config; renders nothing if neither is set.
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID || config.gaId;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
