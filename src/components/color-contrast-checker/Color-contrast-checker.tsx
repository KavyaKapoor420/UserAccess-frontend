"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    calculateWCAG2Contrast,
    getWCAG2Rating,
} from "@/lib/contrast-utils";
import { ArrowLeftRight, Share, Upload, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { extractColorsFromImage } from "@/utils/colorExtraction";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

interface ColorSuggestionResponse {
    success: boolean;
    fixed?: {
        textColor: string;
        backgroundColor: string;
        contrastRatio: number;
    };
    error?: string;
}

export default function ColorContrastChecker() {
    const [textColor, setTextColor] = useState<string>("#000000");
    const [bgColor, setBgColor] = useState<string>("#ffffff");
    const [textColorInput, setTextColorInput] = useState<string>("#000000");
    const [bgColorInput, setBgColorInput] = useState<string>("#ffffff");
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [extracting, setExtracting] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [fixingColors, setFixingColors] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validate and normalize hex color
    const normalizeColor = (color: string | null): string | null => {
        if (!color) return null;

        color = color.trim();

        if (!color.startsWith('#')) {
            color = '#' + color;
        }

        // Expand 3-digit hex to 6-digit
        const shortHex = /^#([0-9A-Fa-f]{3})$/;
        const matchShort = color.match(shortHex);
        if (matchShort) {
            const [r, g, b] = matchShort[1].split('');
            color = `#${r}${r}${g}${g}${b}${b}`;
        }

        const hexRegex6 = /^#[0-9A-Fa-f]{6}$/;
        return hexRegex6.test(color) ? color.toUpperCase() : null;
    };

    // Handle text color change from text input
    const handleTextColorChange = (value: string) => {
        setTextColorInput(value);
        const normalized = normalizeColor(value);
        if (normalized) {
            setTextColor(normalized);
        }
    };

    // Handle background color change from text input
    const handleBgColorChange = (value: string) => {
        setBgColorInput(value);
        const normalized = normalizeColor(value);
        if (normalized) {
            setBgColor(normalized);
        }
    };

    // Handle text color change from color picker
    const handleTextColorPickerChange = (value: string) => {
        const normalized = value.toUpperCase();
        setTextColor(normalized);
        setTextColorInput(normalized);
    };

    // Handle background color change from color picker
    const handleBgColorPickerChange = (value: string) => {
        const normalized = value.toUpperCase();
        setBgColor(normalized);
        setBgColorInput(normalized);
    };

    // Load initial colors from URL query params (e.g., ?text=000000&bg=ffffff&ting=1)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const text = params.get("text");
        const bg = params.get("bg");

        const isHex = (v: string | null) => !!v && /^#?[0-9a-fA-F]{6}$/.test(v);
        const toHashHex = (v: string) => (v.startsWith("#") ? v : `#${v}`).toUpperCase();

        if (isHex(text)) {
            const color = toHashHex(text!);
            setTextColor(color);
            setTextColorInput(color);
        }
        if (isHex(bg)) {
            const color = toHashHex(bg!);
            setBgColor(color);
            setBgColorInput(color);
        }
    }, []);

    const handleShare = async () => {
        const toParam = (v: string) => v.replace(/^#/g, "");
        const url = new URL(window.location.href);
        url.searchParams.set("text", toParam(textColor));
        url.searchParams.set("bg", toParam(bgColor));
        // Include "ting" in the link as requested
        url.searchParams.set("ting", "1");

        const shareUrl = url.toString();
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!", {
                description: "Share this color combination with others",
                duration: 3000,
            });
        } catch {
            // Fallback: create a temporary input to copy
            const el = document.createElement("textarea");
            el.value = shareUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            toast.success("Link copied to clipboard!", {
                description: "Share this color combination with others",
                duration: 3000,
            });
        }
    };

    const handleSwap = () => {
        const t = textColor;
        const b = bgColor;
        setTextColor(b);
        setBgColor(t);
        setTextColorInput(b);
        setBgColorInput(t);
    };

    // Handle drag events for image upload
    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    // Handle image upload and color extraction
    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image is too large (max 10MB)");
            return;
        }

        try {
            setExtracting(true);
            toast.info("Analyzing image colors...");

            // Create preview URL
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);

            // Extract colors
            const colors = await extractColorsFromImage(file);

            // Set the colors
            const normalizedTextColor = colors.textColor.toUpperCase();
            const normalizedBgColor = colors.backgroundColor.toUpperCase();
            setTextColor(normalizedTextColor);
            setBgColor(normalizedBgColor);
            setTextColorInput(normalizedTextColor);
            setBgColorInput(normalizedBgColor);

            toast.success("Colors extracted successfully! 🎨", {
                description: `Text: ${colors.textColor} • Background: ${colors.backgroundColor}`,
                duration: 4000,
            });
        } catch (error) {
            console.error("Color extraction failed:", error);
            toast.error("Failed to extract colors from image");
        } finally {
            setExtracting(false);
        }
    };

    // Handle drop event
    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleImageUpload(e.dataTransfer.files[0]);
        }
    }, []);

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    // Open file dialog
    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    // Clear uploaded image
    const clearImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast.success("Image cleared");
    };

    // Auto fix colors using Gemini AI
    const handleAutoFix = async () => {
        try {
            setFixingColors(true);
            toast.info("AI is fixing your colors...");

            const response = await fetch('/api/color-suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ textColor, backgroundColor: bgColor })
            });

            if (!response.ok) {
                throw new Error('Failed to fix colors');
            }

            const data = await response.json() as ColorSuggestionResponse;

            if (data.success && data.fixed) {
                const normalizedTextColor = data.fixed.textColor.toUpperCase();
                const normalizedBgColor = data.fixed.backgroundColor.toUpperCase();
                setTextColor(normalizedTextColor);
                setBgColor(normalizedBgColor);
                setTextColorInput(normalizedTextColor);
                setBgColorInput(normalizedBgColor);

                toast.success("Colors fixed! ✨", {
                    description: `New contrast ratio: ${data.fixed.contrastRatio || 'N/A'}:1`,
                    duration: 4000,
                });
            } else {
                throw new Error(data.error || 'Failed to fix colors');
            }
        } catch (error) {
            console.error('Auto fix error:', error);
            toast.error("Failed to fix colors", {
                description: error instanceof Error ? error.message : "Please try again later"
            });
        } finally {
            setFixingColors(false);
        }
    };

    // Calculate contrasts
    const wcag2Contrast = calculateWCAG2Contrast(textColor, bgColor);
    const wcag2Rating = getWCAG2Rating(wcag2Contrast);

    const fontSizes = [
        { size: 12, label: "12px" },
        { size: 16, label: "16px" },
        { size: 24, label: "24px" },
        { size: 32, label: "32px" },
    ];

    const fontWeights = [
        { weight: 400, label: "Normal" },
        { weight: 700, label: "Bold" },
    ];

    return (
        <div className="min-h-screen p-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center my-8">
                    <h2 className="md:text-5xl sm:text-4xl text-2xl font-epilogue font-bold tracking-tight mb-2">
                        AI Color Contrast Checker
                    </h2>
                    <p className="text-sm text-[#576170]">
                        Test your color combinations with WCAG 2.2 standards
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Color Pickers */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Color Selection</CardTitle>
                                <Button size="sm" type="button" variant="outline" onClick={handleSwap} className="gap-2">
                                    <ArrowLeftRight className="h-4 w-4" aria-hidden="true" /> Swap
                                </Button>
                            </div>
                            <CardDescription>
                                Choose your text and background colors
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="textColor">Text Color</Label>
                                <div className="flex gap-3 items-center">
                                    <Input
                                        type="color"
                                        id="textColor"
                                        value={textColor}
                                        onChange={(e) => handleTextColorPickerChange(e.target.value)}
                                        className="w-20 h-12 cursor-pointer"
                                        aria-label="Foreground Text Color Picker"
                                        role="button"
                                    />
                                    <Input
                                        type="text"
                                        value={textColorInput}
                                        onChange={(e) => handleTextColorChange(e.target.value)}
                                        className="flex-1 font-mono uppercase"
                                        placeholder="#000000"
                                        aria-label="Foreground Text Color"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bgColor">Background Color</Label>
                                <div className="flex gap-3 items-center">
                                    <Input
                                        type="color"
                                        id="bgColor"
                                        value={bgColor}
                                        onChange={(e) => handleBgColorPickerChange(e.target.value)}
                                        className="w-20 h-12 cursor-pointer"
                                        aria-label="Background Color Picker"
                                        role="button"
                                    />
                                    <Input
                                        type="text"
                                        value={bgColorInput}
                                        onChange={(e) => handleBgColorChange(e.target.value)}
                                        className="flex-1 font-mono uppercase"
                                        placeholder="#FFFFFF"
                                        aria-label="Background Color"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-3">

                                {wcag2Contrast < 4.5 && (
                                    <Button
                                        type="button"
                                        onClick={handleAutoFix}
                                        disabled={fixingColors}
                                        className="gap-2 bg-black"
                                    >
                                        {fixingColors ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Fixing...
                                            </>
                                        ) : (
                                            <>
                                                ⭐ Auto Fix
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <Separator />

                            {/* Live Preview */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Live Preview</Label>
                                <div className="relative overflow-hidden rounded-xl border-2 shadow-lg">
                                    {/* Preview Header */}
                                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 px-4 py-2 border-b">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-xs text-[#4A5568] ml-2">preview</span>
                                        </div>
                                    </div>

                                    {/* Preview Content */}
                                    <div
                                        className="p-8 transition-all duration-300"
                                        style={{
                                            backgroundColor: bgColor,
                                            color: textColor,
                                        }}
                                    >
                                        <div className="space-y-6">
                                            {/* Hero Section */}
                                            <div className="text-center space-y-3">
                                                <h2 className="text-4xl font-bold tracking-tight">
                                                    Beautiful Design
                                                </h2>
                                                <p className="text-lg opacity-90">
                                                    The quick brown fox jumps over the lazy dog
                                                </p>
                                            </div>

                                            {/* Content Section */}
                                            <div className="space-y-4 max-w-2xl mx-auto">
                                                <p className="text-base leading-relaxed">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                </p>
                                                <div className="flex gap-3 justify-center flex-wrap">
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        aria-hidden="true"
                                                        className="px-6 py-2 rounded-lg font-medium border-2 transition-opacity hover:opacity-80"
                                                        style={{
                                                            borderColor: textColor,
                                                            color: textColor,
                                                        }}
                                                    >
                                                        Primary Button
                                                    </button>
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        aria-hidden="true"
                                                        className="px-6 py-2 rounded-lg font-medium transition-opacity hover:opacity-80"
                                                        style={{
                                                            backgroundColor: textColor,
                                                            color: bgColor,
                                                        }}
                                                    >
                                                        Secondary Button
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Score Indicator */}
                                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 px-4 py-2 border-t">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#4A5568]">Contrast Score:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-semibold">{wcag2Contrast.toFixed(2)}:1</span>
                                                <span className="text-lg">
                                                    {wcag2Contrast >= 7 ? '🌟' : wcag2Contrast >= 4.5 ? '✅' : wcag2Contrast >= 3 ? '⚠️' : '❌'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contrast Scores */}
                    <div className="space-y-6">
                        {/* WCAG 2.2 Score */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>WCAG 2.2 Contrast</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">
                                            {wcag2Contrast >= 7 ? '🌟' : wcag2Contrast >= 4.5 ? '✅' : wcag2Contrast >= 3 ? '⚠️' : '❌'}
                                        </span>
                                        <Badge variant="secondary" className="text-lg font-bold">
                                            {wcag2Contrast.toFixed(2)}:1
                                        </Badge>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Web Content Accessibility Guidelines 2.2
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">AA Normal</span>
                                            <span className="text-xl">
                                                {wcag2Rating.aa.normal ? '✅' : '❌'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Requires 4.5:1
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">AA Large</span>
                                            <span className="text-xl">
                                                {wcag2Rating.aa.large ? '✅' : '❌'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Requires 3:1
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">AAA Normal</span>
                                            <span className="text-xl">
                                                {wcag2Rating.aaa.normal ? '🌟' : '❌'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Requires 7:1
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">AAA Large</span>
                                            <span className="text-xl">
                                                {wcag2Rating.aaa.large ? '🌟' : '❌'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Requires 4.5:1
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Upload Section */}
                        <Card className="bg-transparent border-none shadow-none">
                            <CardContent >
                                <div
                                    className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
                    ${dragActive ? " bg-blue-50 dark:bg-blue-950" : "border-slate-300 dark:border-slate-700"}
                    ${uploadedImage ? "bg-muted/30" : ""}
                  `}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {uploadedImage ? (
                                        <div className="space-y-3">
                                            <div className="relative inline-block">
                                                <img
                                                    src={uploadedImage}
                                                    alt="Uploaded"
                                                    className="h-32 w-auto rounded-lg border-2 border-border shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    aria-label="Remove uploaded image"
                                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <X className="w-4 h-4" aria-hidden="true" />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-[#005a1f]">
                                                    Colors extracted successfully! 🎨
                                                </p>
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 rounded border-2 border-border shadow-sm"
                                                            style={{ backgroundColor: textColor }}
                                                        />
                                                        <span className="text-xs font-mono">{textColor}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 rounded border-2 border-border shadow-sm"
                                                            style={{ backgroundColor: bgColor }}
                                                        />
                                                        <span className="text-xs font-mono">{bgColor}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Upload another to replace
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
                                            <p className="text-sm font-medium mb-1">
                                                {dragActive ? "Drop your image here" : "Upload an image"}
                                            </p>
                                            <p className="text-xs text-muted-foreground mb-4">
                                                Automatically extract dominant text and background colors
                                            </p>
                                            <div className="flex justify-center">
                                                <HoverBorderGradient
                                                    as="button"
                                                    type="button"
                                                    onClick={openFileDialog}
                                                    containerClassName="rounded-full"
                                                    className="rounded-full flex items-center gap-2 text-sm font-medium px-6 py-2.5 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    disabled={extracting}
                                                >
                                                    {extracting ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            <span>Analyzing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-4 h-4" aria-hidden="true" />
                                                            <span>Choose Image</span>
                                                        </>
                                                    )}
                                                </HoverBorderGradient>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-3">JPG, PNG, WEBP • Max 10MB</p>
                                        </>
                                    )}
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
