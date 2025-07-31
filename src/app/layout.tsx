import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from '@/components/Navigation';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://planning-spec-tool.netlify.app'),
  title: {
    default: "Planning Application Data Specification Tool",
    template: "%s | Planning Spec Tool"
  },
  description: "Interactive tool for exploring UK government's standardized planning application data specifications. Browse 18+ application types, 50+ modules, 200+ fields, and 100+ JSON examples.",
  keywords: ["planning applications", "UK government", "data specifications", "digital land", "planning.data.gov.uk", "JSON schema", "government data", "planning permission"],
  authors: [{ name: "UK Government Digital Land Team" }],
  creator: "UK Government Digital Land Platform",
  publisher: "UK Government",
  category: "Government",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://planning-spec-tool.netlify.app",
    siteName: "Planning Application Data Specification Tool",
    title: "Planning Application Data Specification Tool",
    description: "Interactive tool for exploring UK government's standardized planning application data specifications. Browse 18+ application types, 50+ modules, 200+ fields, and 100+ JSON examples.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Planning Application Data Specification Tool - UK Government Digital Land Platform"
      }
    ]
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@digitalland",
    creator: "@digitalland",  
    title: "Planning Application Data Specification Tool",
    description: "Interactive tool for exploring UK planning application data specifications. 18+ applications, 50+ modules, 200+ fields, 100+ examples.",
    images: ["/twitter-card.svg"]
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  
  manifest: '/site.webmanifest',
  
  // Verification and additional tags
  verification: {
    google: 'google-site-verification-placeholder',
  },
  
  // App-specific metadata
  applicationName: "Planning Spec Tool",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Planning Spec Tool"
  },
  
  // SEO enhancements
  alternates: {
    canonical: "https://planning-spec-tool.netlify.app"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
