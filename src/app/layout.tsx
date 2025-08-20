

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pinoy Play & Learn",
  description: "Enjoy a fun Filipino game that combines fun and education. Explore Filipino culture and language through engaging activities and challenges. Perfect for learning while having fun!",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_11793550-e38b-4edf-a5b6-19ab25e2b57e-buVqYBfspQ1fgZoDGorHlz4vJqygrj",
      button: {
        title: "Open with Ohara",
        action: {
          type: "launch_frame",
          name: "Pinoy Play & Learn",
          url: "https://long-increase-916.preview.series.engineering",
          splashImageUrl: "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#ffffff"
        }
      }
    })
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = (await cookies()).get("x-request-id")?.value;

  return (
    <html lang="en">
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
        <ResponseLogger />
      </body>
    </html>
  );
}