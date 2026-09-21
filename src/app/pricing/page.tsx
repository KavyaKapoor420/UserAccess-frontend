import Image from "next/image";

export default function Pricing() {
    return (
        <section className="bg-white min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
                        Pricing
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-8">
                        Our Pricing Plans
                    </h1>

                    <div className="mt-16 flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-full blur-2xl opacity-60"></div>
                            <div className="relative bg-gray-50 border border-gray-200 rounded-2xl px-16 py-12">
                                <p className="text-6xl sm:text-7xl font-bold text-gray-300 tracking-wide">
                                    Coming Soon...
                                </p>
                            </div>
                        </div>

                        <p className="mt-12 text-lg text-gray-600 max-w-md">
                            We're working on amazing pricing plans for you. Stay tuned!
                        </p>

                        <div className="mt-8 flex items-center gap-2 text-gray-500">
                            <svg className="w-5 h-5 animate-pulse text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Check back later for updates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
