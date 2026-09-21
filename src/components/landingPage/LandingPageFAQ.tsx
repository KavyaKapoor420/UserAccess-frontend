import { FAQ } from "@/components/common/FAQ";

const faqItems = [
    {
        question: "Does UserAccess's Widget use cookies to collect information on my website?",
        answer:
            "UserAccess is a privacy-by-design company. The Widget does not collect any personally identifiable information or cookies. UserAccess can also be excluded from your privacy policy. You can read more at useraccess.live/privacy.",
    },
    {
        question: "How does the Widget integrate into my website and how long does it take?",
        answer:
            "The integration process is very easy and usually takes just a few minutes. You'll just need to add the embed code as the first line in the <head> tag of your HTML. You can also add it into the footer tag, if you prefer. The embed code can be found under your Dashboard.",
    },
    {
        question: "Does the Widget stay updated with changing regulations?",
        answer:
            "UserAccess's AI-Powered Widget is constantly updated to the highest WCAG standards, like the recently released WCAG 2.2.",
    },
    {
        question: "Does the Widget change the colors of my website?",
        answer:
            "The Widget is designed to adapt and personalize the web experience. It does not introduce permanent modifications to a website's design. For website users who select Widget options for high contrast or any other color modification, that color view only appears for them.",
    },
];

export function LandingPageFAQ() {
    return (
        <FAQ
            title="Frequently Asked Questions"
            description="Have questions about our accessibility widget? Here are some of the most commonly asked ones."
            items={faqItems}
        />
    );
}
