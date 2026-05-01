import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NoorBedtime — Islamic Bedtime Stories for Muslim Kids",
    template: "%s | NoorBedtime",
  },
  description:
    "Beautiful bedtime stories for Muslim children aged 3-12. Scholar-validated tales inspired by the Quran and Prophet traditions. 5 free stories — start reading tonight.",
  keywords: [
    "Islamic bedtime stories",
    "Muslim kids stories",
    "Quran stories for kids",
    "Prophet stories for children",
    "Islamic children books",
  ],
  openGraph: {
    type: "website",
    siteName: "NoorBedtime",
    url: "https://noorbedtime.com",
  },
  twitter: { card: "summary_large_image" },
  metadataBase: new URL("https://noorbedtime.com"),
  verification: {
    google: "FILNucUhFCmvI2fYsiBKkOCMEvVl-z8gK46384rQK0c",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
