import { AccessibilitySystemDiagram } from "./AccessibilitySystemDiagram";

function AudienceSection() {
    const audiences = ["Website owners", "Design teams", "Developers", "Accessibility teams", "Every visitor"];

    return (
        <section className="overflow-hidden bg-transparent py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="mx-auto mb-9 max-w-xl text-center">
                    <p className="text-lg font-medium tracking-wide text-slate-900 sm:text-xl">For you if you are building for:</p>
                    <div className="mx-auto mt-2 h-1 w-40 rounded-full bg-amber-400" />
                </div>
                <div className="relative mx-auto max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_13%,black_87%,transparent)]">
                    <div className="audience-marquee flex w-max items-center gap-8 py-2 sm:gap-12">
                        {[...audiences, ...audiences].map((audience, index) => (
                            <div key={`${audience}-${index}`} className="w-max whitespace-nowrap px-1 text-center text-lg font-medium text-slate-900 sm:text-xl">
                                {audience}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function AccessibilitySystemSection() {
    return (
        <>
            <AudienceSection />
            <section className="bg-transparent py-20 sm:py-24">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="mx-auto mb-8 max-w-2xl text-center">
                        <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">For teams: Accessibility infrastructure</span>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">How UserAccess works</h2>
                    </div>

                    <AccessibilitySystemDiagram />
                </div>
            </section>
        </>
    );
}