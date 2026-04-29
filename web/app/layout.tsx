
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "@/context/stacks-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Builder Badge NFT",
  description: "Mint your limited edition Builder Badge on Stacks",
};

import { authenticate } from '../src/lib/stacks-integration';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Stacks ecosystem connectivity
  if (typeof window !== 'undefined') {
    console.info('Stacks connection layer loaded:', authenticate);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <StacksProvider>{children}</StacksProvider>
      </body>
    </html>
  );
}
