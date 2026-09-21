"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import * as motion from "motion/react-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    Copy,
    Download,
    FileText,
    Info,
    AlertCircle,
    Check,
    ChevronsUpDown,
    ChevronDown,
    Eye
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { marked } from "marked"

const INDUSTRIES = [
    "Technology & Software",
    "E-commerce & Retail",
    "Healthcare & Medical",
    "Education & E-Learning",
    "Finance & Banking",
    "Insurance",
    "Real Estate",
    "Legal Services",
    "Marketing & Advertising",
    "Media & Entertainment",
    "Travel & Hospitality",
    "Food & Beverage",
    "Manufacturing",
    "Automotive",
    "Construction",
    "Energy & Utilities",
    "Telecommunications",
    "Transportation & Logistics",
    "Government & Public Sector",
    "Non-Profit & Charity",
    "Consulting Services",
    "Human Resources",
    "Professional Services",
    "Sports & Fitness",
    "Beauty & Cosmetics",
    "Fashion & Apparel",
    "Home & Garden",
    "Agriculture",
    "Environmental Services",
    "Publishing",
    "Gaming",
    "Social Media",
    "Cloud Services",
    "Cybersecurity",
    "Artificial Intelligence",
    "Biotechnology",
    "Pharmaceutical",
    "Research & Development",
    "Event Management",
    "Photography",
    "Music & Audio",
    "Design & Creative",
    "Architecture",
    "Interior Design",
    "Recruitment",
    "Business Services",
    "Accounting",
    "Property Management",
    "Pet Services",
    "Childcare & Daycare",
    "Other",
]

const LANGUAGES = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Japanese",
    "Korean",
    "Arabic",
    "Russian",
    "Hindi",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Polish",
    "Turkish",
    "Greek",
    "Hebrew",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Malay",
    "Czech",
    "Romanian",
    "Hungarian",
    "Ukrainian",
    "Bulgarian",
    "Croatian",
    "Slovak",
]

const ACCESSIBILITY_STANDARDS = [
    { id: "wcag21-a", name: "WCAG 2.1 Level A", description: "Basic web accessibility" },
    { id: "wcag21-aa", name: "WCAG 2.1 Level AA", description: "Recommended standard" },
    { id: "wcag21-aaa", name: "WCAG 2.1 Level AAA", description: "Enhanced accessibility" },
    { id: "wcag22-aa", name: "WCAG 2.2 Level AA", description: "Latest standard" },
    { id: "section508", name: "Section 508", description: "US federal standard" },
    { id: "ada", name: "ADA Compliance", description: "Americans with Disabilities Act" },
    { id: "en301549", name: "EN 301 549", description: "European standard" },
    { id: "aoda", name: "AODA", description: "Ontario accessibility" },
]

const ACCESSIBILITY_FEATURES = [
    "Keyboard Navigation",
    "Screen Reader Support",
    "Alternative Text for Images",
    "Color Contrast Compliance",
    "Text Resizing",
    "Skip Navigation Links",
    "ARIA Landmarks",
    "Accessible Forms",
    "Captions for Video",
    "Transcripts for Audio",
    "Focus Indicators",
    "Accessible PDFs",
    "Mobile Accessibility",
    "Voice Control Support",
]

type StatusType = "working" | "partial" | "full"

interface FormData {
    companyName: string
    websiteUrl: string
    contactEmail: string
    industry: string
    status: StatusType
    languages: string[]
    standards: string[]
    features: string[]
    additionalInfo: string
}

interface CollapsibleSectionProps {
    title: string
    stepNumber: number
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
    badge?: string
}

function CollapsibleSection({ title, stepNumber, isOpen, onToggle, children, badge }: CollapsibleSectionProps) {
    return (
        <motion.section
            className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden"
            initial={false}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-gray-50/50 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="relative flex items-center justify-center h-9 w-9">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-200" />
                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
                        {stepNumber}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
                    {badge && (
                        <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                            {badge}
                        </Badge>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="px-5 pb-6 md:px-6 md:pb-8 pt-2">
                    {children}
                </div>
            </motion.div>
        </motion.section>
    )
}

export function AccessibilityStatementGenerator() {
    const searchParams = useSearchParams()

    const [formData, setFormData] = useState<FormData>({
        companyName: "",
        websiteUrl: "",
        contactEmail: "",
        industry: "",
        status: "working",
        languages: [],
        standards: [],
        features: [],
        additionalInfo: "",
    })

    const [openSections, setOpenSections] = useState({
        basic: true,
        status: false,
        standards: false,
        features: false,
        languages: false,
        additional: false,
    })

    const [activeTab, setActiveTab] = useState<"form" | "preview">("form")
    const [industryOpen, setIndustryOpen] = useState(false)

    useEffect(() => {
        const emailFromUrl = searchParams.get("email")
        if (emailFromUrl) {
            setFormData(prev => ({
                ...prev,
                contactEmail: emailFromUrl
            }))
        }
    }, [searchParams])

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handleLanguageToggle = (language: string) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.includes(language)
                ? prev.languages.filter((l) => l !== language)
                : [...prev.languages, language],
        }))
    }

    const handleStandardToggle = (standardId: string) => {
        setFormData((prev) => ({
            ...prev,
            standards: prev.standards.includes(standardId)
                ? prev.standards.filter((s) => s !== standardId)
                : [...prev.standards, standardId],
        }))
    }

    const handleFeatureToggle = (feature: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter((f) => f !== feature)
                : [...prev.features, feature],
        }))
    }

    const completionPercentage = useMemo(() => {
        let completed = 0
        const total = 6

        if (formData.companyName && formData.contactEmail) completed++
        if (formData.status) completed++
        if (formData.standards.length > 0) completed++
        if (formData.features.length > 0) completed++
        if (formData.languages.length > 0) completed++
        if (formData.additionalInfo || formData.websiteUrl || formData.industry) completed++

        return Math.round((completed / total) * 100)
    }, [formData])

    const generateStatement = () => {
        const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

        let statement = `# Accessibility Statement for ${formData.companyName || "[Company Name]"}\n\n`
        statement += `**Last Updated:** ${date}\n\n`

        if (formData.status === "full") {
            statement += `## Commitment to Accessibility\n\n`
            statement += `${formData.companyName || "[Company Name]"} has been reviewed and meets accessibility standards. We strive to provide an inclusive digital experience for all users.\n\n`
        } else if (formData.status === "partial") {
            statement += `## Our Accessibility Journey\n\n`
            statement += `${formData.companyName || "[Company Name]"} recognizes that some features may not be fully accessible yet. We are actively working on improvements to ensure compliance with accessibility standards.\n\n`
        } else {
            statement += `## Planning for Accessibility\n\n`
            statement += `${formData.companyName || "[Company Name]"} is committed to making our website accessible. We are currently in the planning phase and will implement comprehensive accessibility improvements soon.\n\n`
        }

        if (formData.standards.length > 0) {
            statement += `## Conformance Standards\n\n`
            statement += `Our website aims to conform to the following accessibility standards:\n\n`
            formData.standards.forEach((standardId) => {
                const standard = ACCESSIBILITY_STANDARDS.find((s) => s.id === standardId)
                if (standard) {
                    statement += `- **${standard.name}**: ${standard.description}\n`
                }
            })
            statement += `\n`
        }

        if (formData.features.length > 0) {
            statement += `## Accessibility Features\n\n`
            statement += `We have implemented the following accessibility features:\n\n`
            formData.features.forEach((feature) => {
                statement += `- ${feature}\n`
            })
            statement += `\n`
        }

        if (formData.languages.length > 0) {
            statement += `## Supported Languages\n\n`
            statement += `Our content is available in the following languages: ${formData.languages.join(", ")}.\n\n`
        }

        statement += `## Technical Specifications\n\n`
        statement += `Accessibility of ${formData.websiteUrl || "our website"} relies on the following technologies:\n\n`
        statement += `- HTML5\n`
        statement += `- WAI-ARIA\n`
        statement += `- CSS3\n`
        statement += `- JavaScript\n\n`
        statement += `These technologies are relied upon for conformance with the accessibility standards used.\n\n`

        statement += `## Known Limitations\n\n`
        if (formData.status === "full") {
            statement += `While we strive for full accessibility, we continue to identify and resolve any accessibility issues. If you encounter any barriers, please contact us.\n\n`
        } else if (formData.status === "partial") {
            statement += `We are actively working to address accessibility barriers on our website. Some areas may not yet be fully accessible, and we are prioritizing improvements based on impact and user needs.\n\n`
        } else {
            statement += `Accessibility improvements are actively being implemented on our website. Some areas may not yet be fully accessible, and we will keep you updated on our progress.\n\n`
        }

        statement += `## Assessment Approach\n\n`
        statement += `${formData.companyName || "[Company Name]"} assessed the accessibility of ${formData.websiteUrl || "our website"} through:\n\n`
        statement += `- Self-evaluation\n`
        statement += `- Automated testing tools\n`
        statement += `- Manual testing with assistive technologies\n`
        statement += `- User feedback from people with disabilities\n\n`

        statement += `## Feedback and Contact Information\n\n`
        statement += `We welcome your feedback on the accessibility of ${formData.websiteUrl || "our website"}. Please let us know if you encounter accessibility barriers:\n\n`
        if (formData.contactEmail) {
            statement += `- **Email:** ${formData.contactEmail}\n`
        }
        if (formData.websiteUrl) {
            statement += `- **Website:** ${formData.websiteUrl}\n`
        }
        statement += `\n`
        statement += `We aim to respond to accessibility feedback within 5 business days.\n\n`

        if (formData.additionalInfo) {
            statement += `## Additional Information\n\n`
            statement += `${formData.additionalInfo}\n\n`
        }

        statement += `## Formal Complaints\n\n`
        statement += `If you are not satisfied with our response to your accessibility feedback, you may escalate your concerns through our formal complaint process${formData.contactEmail ? ` by contacting ${formData.contactEmail}` : ""}.\n`

        return statement
    }

    const copyToClipboard = () => {
        const statement = generateStatement()
        navigator.clipboard.writeText(statement)
        toast.success("Statement copied to clipboard!")
    }

    const downloadAsText = () => {
        const statement = generateStatement()
        const blob = new Blob([statement], { type: "text/markdown" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `accessibility-statement-${formData.companyName.replace(/\s+/g, "-").toLowerCase() || "draft"}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Statement downloaded!")
    }

    const downloadAsHTML = async () => {
        const statement = generateStatement()
        const htmlContent = await marked.parse(statement)

        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Statement - ${formData.companyName || "Draft"}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
        h1 { color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { color: #2a2a2a; margin-top: 30px; }
        ul { margin-left: 20px; }
        li { margin-bottom: 8px; }
        strong { color: #1a1a1a; }
        p { margin-bottom: 16px; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`

        const blob = new Blob([fullHTML], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `accessibility-statement-${formData.companyName.replace(/\s+/g, "-").toLowerCase() || "draft"}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("HTML downloaded!")
    }

    const isFormValid = formData.companyName.trim() !== "" && formData.contactEmail.trim() !== ""

    const statusOptions: { value: StatusType; label: string; description: string; icon: React.ReactNode }[] = [
        {
            value: "full",
            label: "Fully Accessible",
            description: "Your website meets accessibility standards",
            icon: <Check className="h-5 w-5" />
        },
        {
            value: "partial",
            label: "Partially Accessible",
            description: "Some features still need improvements",
            icon: <AlertCircle className="h-5 w-5" />
        },
        {
            value: "working",
            label: "Work in Progress",
            description: "Accessibility is being implemented",
            icon: <Info className="h-5 w-5" />
        }
    ]

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            {/* Tab Switcher */}
            <div className="sticky top-4 z-20 mb-8">
                <div className="flex items-center justify-center">
                    <div className="relative flex h-12 items-center rounded-full bg-gray-100/90 backdrop-blur-md p-1 shadow-lg border border-gray-200/50">
                        <button
                            onClick={() => setActiveTab("form")}
                            className={cn(
                                "relative z-10 flex items-center gap-2 px-5 h-10 text-sm font-medium transition-colors duration-200 rounded-full",
                                activeTab === "form" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {activeTab === "form" && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <FileText className="relative z-10 h-4 w-4" />
                            <span className="relative z-10">Create</span>
                        </button>
                        <button
                            onClick={() => isFormValid && setActiveTab("preview")}
                            disabled={!isFormValid}
                            className={cn(
                                "relative z-10 flex items-center gap-2 px-5 h-10 text-sm font-medium transition-colors duration-200 rounded-full",
                                activeTab === "preview" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
                                !isFormValid && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {activeTab === "preview" && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <Eye className="relative z-10 h-4 w-4" />
                            <span className="relative z-10">Preview</span>
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === "form" ? (
                <div className="space-y-4">
                    {/* Progress Indicator */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Statement Completion</span>
                            <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    {/* Section 1: Basic Information */}
                    <CollapsibleSection
                        title="Basic Information"
                        stepNumber={1}
                        isOpen={openSections.basic}
                        onToggle={() => toggleSection("basic")}
                        badge={formData.companyName && formData.contactEmail ? "Complete" : "Required"}
                    >
                        <div className="space-y-5">
                            <p className="text-sm text-gray-500">
                                Fields marked with <span className="text-red-500">*</span> are required.
                            </p>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                                        Company Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="companyName"
                                        placeholder="Your company name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
                                        Website URL
                                    </Label>
                                    <Input
                                        id="websiteUrl"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={formData.websiteUrl}
                                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                                        Contact Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        placeholder="accessibility@example.com"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                                        Industry
                                    </Label>
                                    <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="industry"
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={industryOpen}
                                                className="w-full justify-between h-11 border-gray-200 font-normal"
                                            >
                                                {formData.industry || "Select your industry..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" side="bottom" sideOffset={4}>
                                            <Command>
                                                <CommandInput placeholder="Search industry..." />
                                                <CommandList>
                                                    <CommandEmpty>No industry found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {INDUSTRIES.map((industry) => (
                                                            <CommandItem
                                                                key={industry}
                                                                value={industry}
                                                                onSelect={(currentValue) => {
                                                                    const selectedIndustry = INDUSTRIES.find(
                                                                        (ind) => ind.toLowerCase() === currentValue.toLowerCase()
                                                                    )
                                                                    setFormData({
                                                                        ...formData,
                                                                        industry: selectedIndustry === formData.industry ? "" : (selectedIndustry ?? "")
                                                                    })
                                                                    setIndustryOpen(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.industry === industry ? "opacity-100 text-blue-600" : "opacity-0"
                                                                    )}
                                                                />
                                                                {industry}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Section 2: Implementation Status */}
                    <CollapsibleSection
                        title="Implementation Status"
                        stepNumber={2}
                        isOpen={openSections.status}
                        onToggle={() => toggleSection("status")}
                        badge={statusOptions.find(s => s.value === formData.status)?.label}
                    >
                        <div className="space-y-3" role="radiogroup" aria-label="Implementation status">
                            {statusOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                        formData.status === option.value
                                            ? "border-blue-500 bg-blue-50/50"
                                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                    )}
                                    onClick={() => setFormData({ ...formData, status: option.value })}
                                    role="radio"
                                    aria-checked={formData.status === option.value}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            setFormData({ ...formData, status: option.value })
                                        }
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "flex items-center justify-center h-10 w-10 rounded-xl transition-colors",
                                            formData.status === option.value
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-500"
                                        )}
                                    >
                                        {option.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                    <div
                                        className={cn(
                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                            formData.status === option.value ? "border-blue-500" : "border-gray-300"
                                        )}
                                    >
                                        {formData.status === option.value && (
                                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* Section 3: Accessibility Standards */}
                    <CollapsibleSection
                        title="Accessibility Standards"
                        stepNumber={3}
                        isOpen={openSections.standards}
                        onToggle={() => toggleSection("standards")}
                        badge={formData.standards.length > 0 ? `${formData.standards.length} selected` : undefined}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-gray-400" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>Select the accessibility standards your website follows or aims to comply with</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <span className="text-sm text-gray-500">Select all that apply</span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {ACCESSIBILITY_STANDARDS.map((standard) => (
                                    <div
                                        key={standard.id}
                                        className={cn(
                                            "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                            formData.standards.includes(standard.id)
                                                ? "border-blue-500 bg-blue-50/50"
                                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                        )}
                                        onClick={() => handleStandardToggle(standard.id)}
                                        tabIndex={0}
                                        role="button"
                                        aria-pressed={formData.standards.includes(standard.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                handleStandardToggle(standard.id)
                                            }
                                        }}
                                    >
                                        <Checkbox
                                            checked={formData.standards.includes(standard.id)}
                                            onCheckedChange={() => handleStandardToggle(standard.id)}
                                            className="mt-0.5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">{standard.name}</div>
                                            <div className="text-sm text-gray-500">{standard.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Section 4: Accessibility Features */}
                    <CollapsibleSection
                        title="Accessibility Features"
                        stepNumber={4}
                        isOpen={openSections.features}
                        onToggle={() => toggleSection("features")}
                        badge={formData.features.length > 0 ? `${formData.features.length} selected` : undefined}
                    >
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {ACCESSIBILITY_FEATURES.map((feature) => (
                                <div
                                    key={feature}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                                        formData.features.includes(feature)
                                            ? "bg-blue-50 border-blue-500"
                                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                    )}
                                    onClick={() => handleFeatureToggle(feature)}
                                    tabIndex={0}
                                    role="button"
                                    aria-pressed={formData.features.includes(feature)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            handleFeatureToggle(feature)
                                        }
                                    }}
                                >
                                    <Checkbox
                                        checked={formData.features.includes(feature)}
                                        onCheckedChange={() => handleFeatureToggle(feature)}
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* Section 5: Languages */}
                    <CollapsibleSection
                        title="Supported Languages"
                        stepNumber={5}
                        isOpen={openSections.languages}
                        onToggle={() => toggleSection("languages")}
                        badge={formData.languages.length > 0 ? `${formData.languages.length} selected` : undefined}
                    >
                        <div className="space-y-4">
                            {formData.languages.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.languages.map((lang) => (
                                        <Badge
                                            key={lang}
                                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                                            onClick={() => handleLanguageToggle(lang)}
                                        >
                                            {lang}
                                            <span className="ml-1 text-blue-500">×</span>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                {LANGUAGES.map((language) => (
                                    <div
                                        key={language}
                                        className={cn(
                                            "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all duration-200",
                                            formData.languages.includes(language)
                                                ? "bg-blue-50 border-blue-500"
                                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                        )}
                                        onClick={() => handleLanguageToggle(language)}
                                        tabIndex={0}
                                        role="button"
                                        aria-pressed={formData.languages.includes(language)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                handleLanguageToggle(language)
                                            }
                                        }}
                                    >
                                        <Checkbox
                                            checked={formData.languages.includes(language)}
                                            onCheckedChange={() => handleLanguageToggle(language)}
                                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{language}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Section 6: Additional Information */}
                    <CollapsibleSection
                        title="Additional Information"
                        stepNumber={6}
                        isOpen={openSections.additional}
                        onToggle={() => toggleSection("additional")}
                        badge={formData.additionalInfo ? "Added" : undefined}
                    >
                        <Textarea
                            placeholder="E.g., Our commitment to ongoing testing, third-party audits, remediation timelines, etc."
                            value={formData.additionalInfo}
                            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                            rows={4}
                            className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </CollapsibleSection>

                    {/* Validation Alert */}
                    {!isFormValid && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200"
                        >
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">
                                Please fill in the required fields (Company Name and Contact Email) to generate your statement.
                            </p>
                        </motion.div>
                    )}

                    {/* Generate Button */}
                    {isFormValid && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center pt-4"
                        >
                            <Button
                                size="lg"
                                onClick={() => setActiveTab("preview")}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-12 rounded-xl shadow-lg shadow-blue-500/25"
                            >
                                <Eye className="h-5 w-5 mr-2" />
                                Preview Statement
                            </Button>
                        </motion.div>
                    )}
                </div>
            ) : (
                /* Preview Tab */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                        {/* Preview Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Generated Statement</h3>
                                <p className="text-sm text-gray-500">Preview and download your accessibility statement</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={copyToClipboard}
                                                className="h-10 w-10 border-gray-200"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy to clipboard</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={downloadAsText}
                                                className="h-10 w-10 border-gray-200"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Download as Markdown</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <Button
                                    onClick={downloadAsHTML}
                                    className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download HTML
                                </Button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="p-5 md:p-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 overflow-auto max-h-[600px]">
                                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                                    {generateStatement()}
                                </pre>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}