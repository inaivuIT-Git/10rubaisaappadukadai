import type { Metadata } from "next";
import { Noto_Sans_Tamil } from "next/font/google";

import "./globals.css";

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tamil",
});

const siteUrl = "https://www.10rubaisaappadukadai.com";
const title = "10 ரூபாய் சாப்பாட்டுக்கடை | Salem";
const description =
  "சேலத்தில் அனைவருக்கும் மலிவு விலையில் உணவு வழங்கும் 10 ரூபாய் சாப்பாட்டுக்கடை — பசியில்லா சமூகத்தை நோக்கிய ஒரு சமூக முயற்சி.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ta_IN",
    url: siteUrl,
    siteName: "10 ரூபாய் சாப்பாட்டுக்கடை",
    title,
    description,
    images: [
      {
        url: "/images/hero-food.jpg",
        alt: "10 ரூபாய் சாப்பாட்டுக்கடை - Salem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-food.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta">
      <body className={notoSansTamil.variable}>{children}</body>
    </html>
  );
}
