import type { Metadata } from "next";
import { rubik } from "./fonts";
import "@/src/app/globals.css";

export const metadata: Metadata = {
  title: "Boba Tracker",
  description: "Boba Tracker",
  icons: [
    {
      rel: "icon",
      type: "image/ico",
      sizes: "32x32",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.className}>
      <body>{children}</body>
    </html>
  );
}
