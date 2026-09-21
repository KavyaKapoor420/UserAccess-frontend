export function HeroSection() {
    return (
        <section
            className="py-20 sm:py-28 rounded-b-[3rem]"
            style={{ background: "linear-gradient(180deg, #1453E7 0%, #103894 100%)" }}
        >
            <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    Free WCAG Color
                    <br />
                    Contrast Checker
                </h1>
                <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                    Check your color combinations against WCAG 2.1 accessibility guidelines. Ensure your text is readable for everyone, including users with visual impairments.
                </p>
            </div>
        </section>
    );
}
