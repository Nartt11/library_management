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
      <body className="">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              success: "!bg-green-600 !text-white !border-green-700",
              error: "!bg-red-600 !text-white !border-red-700",
              warning: "!bg-yellow-500 !text-black !border-yellow-600",
              info: "!bg-blue-600 !text-white !border-blue-700",
            },
          }}
        />
      </body>
    </html>
  );
}
