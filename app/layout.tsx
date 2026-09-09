import type { Metadata } from "next";
import { Noto_Sans_Tamil } from "next/font/google";

import "./globals.css";

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tamil",
});

export const metadata: Metadata = {
  title: "10 ரூபாய் சாப்பாட்டுக்கடை",
  description:
    "சுவையான உணவை எளிய விலையில் அனைவருக்கும் வழங்கும் ஒரு சிறிய முயற்சி.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta">
      <body className={notoSansTamil.variable}>
        {children}
      </body>
    </html>
  );
}