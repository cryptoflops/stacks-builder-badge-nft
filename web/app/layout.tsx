
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "@/context/stacks-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Builder Badge NFT",
  description: "Mint your limited edition Builder Badge on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StacksProvider>{children}</StacksProvider>
      </body>
    </html>
  );
}
