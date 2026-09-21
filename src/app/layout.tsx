import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Banner } from "@/components/common/Banner";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AccessibilityWidgetPreview } from "@/components/common/AccessibilityWidgetPreview";
import { instrumentSerif } from "@/lib/fonts";
import Script from "next/script";
import { ConsentManagerProvider, CookieBanner, ConsentManagerDialog } from "@c15t/nextjs"

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
});

export const metadata: Metadata = {
  title: {
    default: "UserAccess - Free Accessibility Widget for Websites",
    template: "%s | UserAccess",
  },
  description: "Make your website accessible to everyone with our free accessibility widget. WCAG 2.1 compliant, easy integration, 20+ features including text-to-speech, color adjustments, and content enlargement.",
  keywords: [
    "accessibility widget",
    "web accessibility",
    "WCAG compliance",
    "ADA compliance",
    "accessibility tool",
    "screen reader",
    "text to speech",
    "website accessibility",
    "free accessibility widget",
    "accessibility overlay",
  ],
  authors: [{ name: "UserAccess Team" }],
  creator: "UserAccess",
  publisher: "UserAccess",
  metadataBase: new URL("https://useraccess.live"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://useraccess.live",
    siteName: "UserAccess",
    title: "UserAccess - Free Accessibility Widget for Websites",
    description: "Make your website accessible to everyone with our free accessibility widget. WCAG 2.1 compliant with 20+ features.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "UserAccess - Accessibility Widget",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UserAccess - Free Accessibility Widget",
    description: "Make your website accessible to everyone with our free WCAG compliant widget.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${schibsted.variable} ${instrumentSerif.variable} antialiased`}>
        {process.env.NODE_ENV === "production" && (
          <>
            <ConsentManagerProvider
              options={{
                mode: 'offline',
                consentCategories: ['necessary', 'marketing'],
              }}
            >
              <CookieBanner
                title="🍪 Cookie Preferences"
                description="UserAccess uses cookies to enhance your experience and help us improve our accessibility tools. You can customize your preferences anytime."
                theme={{
                  "banner.root": "bg-white border border-gray-200 shadow-xl rounded-2xl",
                  "banner.header.title": "text-gray-900 font-bold text-lg",
                  "banner.header.description": "text-gray-600 text-sm",
                  "banner.footer.reject-button": "bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl transition-all duration-200",
                  "banner.footer.accept-button": "bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200",
                  "banner.footer.customize-button": "bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-5 py-2.5 rounded-xl border border-blue-200 transition-all duration-200",
                }}
              />
            </ConsentManagerProvider>
            <Script
              src="/api/script.js"
              data-site-id="16e54cb27e5c"
              strategy="afterInteractive"
            />
          </>
        )}
        <Banner />
        <Navbar />
        {children}
        <Footer />
        <AccessibilityWidgetPreview />
      </body>
    </html >
  );
}
