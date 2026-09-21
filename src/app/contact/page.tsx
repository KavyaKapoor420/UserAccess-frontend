"use client";

import Image from "next/image";
import { ContactHeader } from "@/components/contact/ContactHeader";
import { ContactForm } from "@/components/contact/ContactForm";

export default function Contact() {
    return (
        <section className="bg-white min-h-screen py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#bfdbfe] to-[#60a5fa] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <ContactHeader />

                <div className="grid lg:grid-cols-2 gap-16 items-start mt-12">
                    <div className="hidden lg:flex flex-col justify-center h-full relative">
                        <div className="relative isolate">
                            <div className="absolute -inset-4 rounded-3xl bg-blue-50/50 backdrop-blur-sm -z-10"></div>
                            <Image
                                src="/images/contact.png"
                                alt="Contact illustration"
                                width={600}
                                height={500}
                                className="object-contain drop-shadow-xl hover:scale-[1.02] transition-transform duration-500"
                                priority
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-900/5 border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-2xl opacity-60"></div>
                        <div className="relative">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}