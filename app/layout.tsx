import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "UIT Library Management System",
  description:
    "Modern Library Management System for University of Infomation Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
