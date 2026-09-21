interface HeroSectionProps {
    onGenerateClick?: () => void;
}

export function HeroSection({ onGenerateClick }: HeroSectionProps) {
    return (
        <section className="bg-[#4a5b6d] py-20 sm:py-28">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    Generate Your Custom
                    <br />
                    Accessibility Statement for Free!
                </h1>
                <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
                    An accessibility statement is an important feature for organizations committed to diversity, equity, and inclusion.
                </p>
            </div>
        </section>
    );
}
