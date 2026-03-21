import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EvalsHQ | Open Source Simulation Engine",
  description: "The deterministic world-builder for enterprise AI. Run high-fidelity, 15-act behavioral simulations to validate your agent's ethics, morale impact, and corporate risk.",
  openGraph: {
    title: "EvalsHQ | Open Source Simulation Engine",
    description: "The deterministic world-builder for enterprise AI.",
    url: "https://evalshq.com",
    siteName: "EvalsHQ",
    images: [
      {
        url: "https://evalshq.com/og-image.jpg", // You can update this later when you have an OG image!
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}