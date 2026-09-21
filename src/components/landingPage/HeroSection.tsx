import React from "react";
import Image from "next/image";
import { Highlighter } from "@/components/ui/highlighter";
import { instrumentSerif } from "@/lib/fonts";

export const CurlyArrow = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M90 10 C 60 5, 20 20, 40 50 C 60 70, 70 30, 40 20 C 20 15, 10 50, 10 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 65 L 10 80 L 22 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const HeroSection = () => {
    return (
        <section className="bg-transparent py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="flex flex-col items-center md:hidden ">
                        <span className={`p-1 text-bold text-2xl italic ${instrumentSerif.className}`}>
                            <Highlighter action="circle" color="#FF9800">For every visitor</Highlighter>
                        </span>
                        <CurlyArrow className="mt-2 h-6 w-6 scale-x-[-1] text-gray-400" />
                    </div>

                    <div className="hidden w-full flex-col items-center md:flex">
                        <span className={`mt-8 ml-52 text-lg font-light italic ${instrumentSerif.className}`}>
                            <Highlighter action="circle" color="#FF9800">For every visitor</Highlighter>
                        </span>
                        <CurlyArrow className="-mt-1 ml-32 h-7 w-7 text-red-900" />
                    </div>

                    <h1 className="text-[2.5rem] font-medium leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                        Make Your Website <br/>
                        <Highlighter action="highlight" color="#FF9800">Accessible</Highlighter> to Everyone
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                        Add our free accessibility widget to your website and empower all users to navigate, read, and interact with your content effortlessly.
                    </p>
                </div>

                {/* Image Showcase */}
                <div className="mt-16 flex items-center justify-center">
                    {/* Left Image - using hero2 now */}
                    <div className="relative w-64 md:w-80 lg:w-96 opacity-90">
                        <div className="overflow-hidden">
                            <Image
                                src="/images/hero2.png"
                                alt="Accessibility showcase 2"
                                width={2841}
                                height={1746}
                                quality={100}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    {/* Center Image - Larger and prominent, overlapping sides - using hero1 now */}
                    <div className="relative w-80 md:w-96 lg:w-xl z-10 -mx-12 md:-mx-16 lg:-mx-20">
                        <div className="overflow-hidden">
                            <Image
                                src="/images/hero1.png"
                                alt="Accessibility showcase 1"
                                width={2841}
                                height={1746}
                                quality={100}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-64 md:w-80 lg:w-96 opacity-90">
                        <div className="overflow-hidden">
                            <Image
                                src="/images/hero3.png"
                                alt="Accessibility showcase 3"
                                width={2841}
                                height={1746}
                                quality={100}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
