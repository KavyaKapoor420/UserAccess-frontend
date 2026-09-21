import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { AddWidgetSection } from './AddWidgetSection';
import { LandingPageFAQ } from './LandingPageFAQ';
import { AccessibilitySystemSection } from './AccessibilitySystemSection';

export default function Home() {
    return (
        <div>
            <HeroSection />
            <AccessibilitySystemSection />
            <FeaturesSection />
            <AddWidgetSection />
            <LandingPageFAQ />
        </div>
    );
}