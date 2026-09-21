import { Suspense } from "react";
import { HeroSection } from "@/components/accessibility-statement-generator/HeroSection";
import { AccessibilityStatementGenerator } from "@/components/accessibility-statement-generator/statement-generator";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Accessibility Statement Generator | Create WCAG Compliant Statements",
    description: "Generate a professional, legally-compliant accessibility statement for your website in minutes. Customize for WCAG 2.1/2.2, ADA, Section 508, and EN 301 549 standards. Free, no signup required.",
    keywords: [
        "accessibility statement generator",
        "WCAG compliance",
        "ADA compliance",
        "accessibility statement template",
        "web accessibility",
        "Section 508",
        "EN 301 549",
        "accessibility policy",
        "free accessibility tools",
    ],
    openGraph: {
        title: "Free Accessibility Statement Generator | UserAccess",
        description: "Create a professional, WCAG-compliant accessibility statement for your website in minutes. Customize standards, features, and download in Markdown or HTML.",
        url: "https://useraccess.live/tools/accessibility-statement-generator",
        siteName: "UserAccess",
        images: [
            {
                url: "/images/statement-og.png",
                width: 1200,
                height: 630,
                alt: "UserAccess Accessibility Statement Generator - Create WCAG compliant accessibility statements",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Accessibility Statement Generator",
        description: "Generate a professional accessibility statement for your website. Supports WCAG 2.1/2.2, ADA, Section 508 compliance.",
        images: ["/images/statement-og.png"],
    },
    alternates: {
        canonical: "https://useraccess.live/tools/accessibility-statement-generator",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function AccessibilityStatementGeneratorPage() {
    return (
        <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
            <HeroSection />
            <div className="py-16 sm:py-20" id="generator">
                <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
                    <AccessibilityStatementGenerator />
                </Suspense>
            </div>
        </main>
    );
}
