import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Levante",
  url: siteUrl,
  logo: `${siteUrl}/levante-logo.svg`,
};

export const metadata: Metadata = {
  title: "Use MCPs easily",
  description: "Join the open-source mission to democratize Model Context Protocols",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Use MCPs easily",
    description:
      "Join the open-source mission to democratize Model Context Protocols",
    siteName: "Levante",
    images: [
      {
        url: "/levante-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Levante thumbnail",
      },
    ],
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
