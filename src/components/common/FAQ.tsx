"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    title?: string;
    description?: string;
    items: FAQItem[];
}

export function FAQ({ title, description, items }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-24 bg-gray-50">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                {title && (
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-4">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
                        {description}
                    </p>
                )}

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-200"
                                aria-expanded={openIndex === index}
                            >
                                <span className="text-base font-medium text-gray-900">
                                    {item.question}
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <svg
                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${openIndex === index ? "rotate-45" : ""
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </span>
                            </button>
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
