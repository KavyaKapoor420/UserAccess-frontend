"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DropdownItem {
    label: string;
    href: string;
    description?: string;
}

interface NavLink {
    label: string;
    hasDropdown: boolean;
    href?: string;
    items?: DropdownItem[];
}

const navLinks: NavLink[] = [
    {
        label: 'Product',
        hasDropdown: true,
        items: [
            { label: 'Accessibility Widget', href: '/#widget', description: 'Customizable accessibility overlay' },
            { label: 'Features', href: '/#features', description: 'Explore all accessibility features' },
            { label: 'Pricing', href: '/pricing', description: 'Plans for every business size' },
        ],
    },
    {
        label: 'Tools',
        hasDropdown: true,
        items: [
            { label: 'Statement Generator', href: '/tools/accessibility-statement-generator', description: 'Create accessibility statements' },
            { label: 'Color Contrast Checker', href: '/tools/color-contrast-checker', description: 'Test WCAG 2.2 color contrast' },
        ],
    },
    {
        label: 'Integrations',
        hasDropdown: true,
        items: [
            { label: 'WordPress', href: '#', description: 'Easy WordPress plugin' },
            { label: 'Shopify', href: '#', description: 'Shopify app integration' },
            { label: 'React', href: '#', description: 'React component library' },
        ],
    },
    { label: 'Contact', hasDropdown: false, href: '/contact' },
];

const ChevronDown = ({ isOpen }: { isOpen?: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const ArrowRight = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-2"
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleMouseEnter = (label: string) => {
        setOpenDropdown(label);
    };

    const handleMouseLeave = () => {
        setOpenDropdown(null);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/logo.png"
                                alt="Access"
                                width={120}
                                height={32}
                                className="h-14 w-auto"
                            />
                            <span className="text-2xl font-bold text-[#0066FF]">
                                Access
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            link.hasDropdown ? (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(link.label)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button
                                        className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${openDropdown === link.label
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.label}
                                        <ChevronDown isOpen={openDropdown === link.label} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openDropdown === link.label && link.items && (
                                        <div className="absolute top-full left-0 pt-2">
                                            <div className="bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[260px] overflow-hidden">
                                                {link.items.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="font-medium text-gray-900 text-sm">
                                                            {item.label}
                                                        </div>
                                                        {item.description && (
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href || '#'}
                                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/#widget"
                            className="flex items-center bg-[#0066FF] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Get Free Widget
                            <ArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
