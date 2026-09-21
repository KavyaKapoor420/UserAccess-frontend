
export function ContactHeader() {
    return (
        <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-sm font-medium text-blue-600 mb-6 shadow-sm backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                Get in Touch
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Contact Us
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Have questions about our accessibility widget? We'd love to hear from you.
                Our team is ready to help you make your website accessible to everyone.
            </p>
        </div>
    );
}
