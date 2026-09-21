"use client";

import { useState } from "react";
import { Turnstile } from "next-turnstile";

export function ContactForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        message: "",
    });
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errors, setErrors] = useState<{ turnstile?: string }>({});
    const [turnstileKey, setTurnstileKey] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!turnstileToken) {
            setErrors({ turnstile: "Please complete the verification" });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch("/api/resend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    turnstileToken,
                }),
            });

            if (response.ok) {
                setSubmitStatus("success");
                setFormData({ fullName: "", email: "", message: "" });
                setTurnstileToken(null);
                setTurnstileKey((prev) => prev + 1);
            } else {
                setSubmitStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold leading-6 text-gray-900 mb-2.5">
                        Full name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="block w-full rounded-2xl border-0 px-5 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 mb-2.5">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="block w-full rounded-2xl border-0 px-5 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 mb-2.5">
                        Message
                    </label>
                    <div className="relative">
                        <textarea
                            name="message"
                            id="message"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us how we can help..."
                            className="block w-full rounded-2xl border-0 px-5 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-y"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
                <Turnstile
                    key={turnstileKey}
                    theme="light"
                    size="normal"
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onVerify={(token) => {
                        setTurnstileToken(token);
                        setErrors((prev) => {
                            const { turnstile, ...rest } = prev;
                            return rest;
                        });
                    }}
                    onError={() => {
                        setTurnstileToken(null);
                        setErrors((prev) => ({
                            ...prev,
                            turnstile: "Security verification failed. Please try again.",
                        }));
                    }}
                    onExpire={() => {
                        setTurnstileToken(null);
                    }}
                />
                {errors.turnstile && (
                    <p className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">{errors.turnstile}</p>
                )}
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || !turnstileToken}
                    className="group relative flex w-full justify-center items-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:shadow-blue-600/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Message...
                        </>
                    ) : (
                        <span className="flex items-center gap-2">
                            Send Message
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    )}
                </button>
            </div>

            {submitStatus === "success" && (
                <div className="rounded-2xl bg-green-50/80 backdrop-blur border border-green-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-semibold text-green-800">Message sent successfully!</h3>
                            <p className="mt-2 text-sm text-green-700">
                                Thank you for reaching out. We will get back to you as soon as possible.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {submitStatus === "error" && (
                <div className="rounded-2xl bg-red-50/80 backdrop-blur border border-red-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-semibold text-red-800">Something went wrong</h3>
                            <p className="mt-2 text-sm text-red-700">
                                Please try again later or contact us directly at support@useraccess.live
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
