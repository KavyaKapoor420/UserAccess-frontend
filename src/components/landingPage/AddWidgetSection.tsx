"use client";

import { useState } from "react";

const widgetScript = `<script 
  src="https://widget-v1.useraccess.live/"
  data-asw-lang="en"
  data-asw-position="bottom-right"
  data-asw-icon-type="m-full"
></script>`;

export function AddWidgetSection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(widgetScript);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <section id="widget" className="bg-transparent py-24 sm:py-32">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="mb-16">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
                        Easy Integration
                    </span>
                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-6">
                        Add Widget to Your Site
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        Make your website accessible in seconds. Simply copy the script below and paste it into your website's HTML, just before the closing <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">&lt;/body&gt;</code> tag.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                    <div className="relative bg-gray-900 rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                </div>
                                <span className="text-gray-400 text-sm font-medium">index.html</span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <pre className="text-sm md:text-base">
                                <code className="text-gray-300">
                                    <span className="text-gray-500">{"<!-- Add this script before closing </body> tag -->"}</span>
                                    {"\n"}
                                    <span className="text-pink-400">{"<script"}</span>
                                    {"\n  "}
                                    <span className="text-cyan-400">src</span>
                                    <span className="text-gray-400">=</span>
                                    <span className="text-green-400">"https://widget-v1.useraccess.live/"</span>
                                    {"\n  "}
                                    <span className="text-cyan-400">data-asw-lang</span>
                                    <span className="text-gray-400">=</span>
                                    <span className="text-green-400">"en"</span>
                                    {"\n  "}
                                    <span className="text-cyan-400">data-asw-position</span>
                                    <span className="text-gray-400">=</span>
                                    <span className="text-green-400">"bottom-right"</span>
                                    {"\n  "}
                                    <span className="text-cyan-400">data-asw-icon-type</span>
                                    <span className="text-gray-400">=</span>
                                    <span className="text-green-400">"m-full"</span>
                                    {"\n"}
                                    <span className="text-pink-400">{"></script>"}</span>
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
