import React from "react";

const features = [
    {
        title: "Enlarge content",
        description: "Enlarge cursor or add bigger text for your website visitors.",
    },
    {
        title: "Make the site readable",
        description: "Add reading line, tooltips and make fonts readable.",
    },
    {
        title: "Adjust colors",
        description: "Change brightness, contrast and grayscale.",
    },
    {
        title: "Fast install",
        description: "Our Shopify and WordPress apps take less than a minute to install!",
    },
    {
        title: "Helps users",
        description: "App is designed to assist with meeting certain requirements of WCAG 2.1.",
    },
    {
        title: "Text to voice",
        description: "Our created robot will read the content of page to your visitors.",
    },
];

export const FeaturesSection = () => {
    return (
        <section id="features" className="bg-transparent py-24 sm:py-32">
            <div className="mx-auto w-[95%] max-w-6xl">
                <div className="mx-auto text-center">
                    <span className="inline-flex rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                        Why UserAccess exists?
                    </span>
                    <h2 className="mt-8 text-4xl font-medium tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                        Our main features
                    </h2>
                </div>

                <div className="relative mt-16 grid grid-cols-1 border-l border-t border-slate-200 bg-white/75 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <article key={feature.title} className="relative min-h-[245px] border-b border-r border-slate-200 px-8 pb-8 pt-20">
                            <span className="absolute left-8 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-700 text-sm text-white shadow-[0_4px_15px_rgba(100,116,139,0.45)]">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className="text-xl font-semibold leading-tight text-slate-900">{feature.title}</h3>
                            <p className="mt-4 max-w-xs text-base leading-7 text-slate-500">{feature.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
