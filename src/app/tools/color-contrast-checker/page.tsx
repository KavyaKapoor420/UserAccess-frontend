import type { Metadata } from "next";
import { HeroSection } from "@/components/color-contrast-checker/HeroSection";
import ColorContrastChecker from "@/components/color-contrast-checker/Color-contrast-checker";

export const metadata: Metadata = {
    title: "Free WCAG Color Contrast Checker | Test Accessibility Compliance",
    description: "Check your color combinations against WCAG 2.1 and 2.2 accessibility guidelines. Test text and background colors for AA and AAA compliance. Free online tool, no signup required.",
    keywords: [
        "color contrast checker",
        "WCAG contrast",
        "accessibility color checker",
        "contrast ratio calculator",
        "WCAG 2.1",
        "WCAG 2.2",
        "AA compliance",
        "AAA compliance",
        "web accessibility",
        "color accessibility",
    ],
    openGraph: {
        title: "Free WCAG Color Contrast Checker | UserAccess",
        description: "Test your color combinations for WCAG accessibility compliance. Check contrast ratios for AA and AAA levels instantly.",
        url: "https://useraccess.live/tools/color-contrast-checker",
        siteName: "UserAccess",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/images/color-contrast-og.png",
                width: 1200,
                height: 630,
                alt: "UserAccess Color Contrast Checker",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free WCAG Color Contrast Checker",
        description: "Test your color combinations for WCAG accessibility compliance. Check contrast ratios instantly.",
        images: ["/images/color-contrast-og.png"],
    },
    alternates: {
        canonical: "https://useraccess.live/tools/color-contrast-checker",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ColorContrastCheckerPage() {
    return (
        <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <HeroSection />
            <div className="py-8 sm:py-12" id="checker">
                <ColorContrastChecker />
            </div>
        </main>
    );
}
