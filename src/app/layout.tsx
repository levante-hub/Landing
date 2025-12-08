import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Use MCPs easily",
  description: "Join the open-source mission to democratize Model Context Protocols",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Use MCPs easily",
    description:
      "Join the open-source mission to democratize Model Context Protocols",
    images: [
      {
        url: "/levante-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Levante thumbnail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Use MCPs easily",
    description: "Join the open-source mission to democratize Model Context Protocols",
    images: ["/levante-thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
