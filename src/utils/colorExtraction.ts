/**
 * Extract dominant colors from an image using canvas
 */

interface ColorData {
    r: number;
    g: number;
    b: number;
    hex: string;
    count: number;
    brightness: number;
}

interface ExtractedColors {
    textColor: string;
    backgroundColor: string;
    allColors: {
        hex: string;
        count: number;
        brightness: number;
    }[];
    accentColors: string[];
}

export async function extractColorsFromImage(file: File): Promise<ExtractedColors> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        let objectUrl: string | undefined;

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    const maxSize = 200;
                    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    let imageData;
                    try {
                        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    } catch (err) {
                        // Likely a SecurityError due to a tainted canvas
                        return reject(new Error('Unable to access image data. The image may be cross-origin protected.'));
                    }
                    const pixels = imageData.data;
                    const colors = analyzePixels(pixels);
                    resolve(colors);
                } finally {
                    if (objectUrl) URL.revokeObjectURL(objectUrl);
                }
            };

            img.onerror = (err) => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
                reject(err);
            };

            // Reader was invoked with readAsDataURL, so result is a data URL string
            // Use it directly to avoid cross-origin tainting; keep object URL path for future extensibility
            if (e.target && typeof e.target.result === 'string') {
                img.src = e.target.result;
            } else if (e.target && e.target.result instanceof ArrayBuffer) {
                // Should not happen with readAsDataURL but for type safety
                const blob = new Blob([e.target.result]);
                objectUrl = URL.createObjectURL(blob);
                img.src = objectUrl;
            } else {
                reject(new Error("Failed to read file"));
            }
        };


        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Analyze pixels to find dominant text and background colors
 */
function analyzePixels(pixels: Uint8ClampedArray): ExtractedColors {
    const colorMap = new Map<string, number>();

    // Sample pixels (skip every 4 for performance)
    for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Round to reduce color variations (more aggressive rounding for better grouping)
        const roundedR = Math.round(r / 15) * 15;
        const roundedG = Math.round(g / 15) * 15;
        const roundedB = Math.round(b / 15) * 15;

        const key = `${roundedR},${roundedG},${roundedB}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    // Sort by frequency
    const sortedColors: ColorData[] = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => {
            const [r, g, b] = key.split(',').map(Number);
            return {
                r,
                g,
                b,
                hex: rgbToHex(r, g, b),
                count,
                brightness: getBrightness(r, g, b)
            };
        });

    console.log('🎨 Color extraction - Top 10 colors by frequency:',
        sortedColors.slice(0, 10).map(c => ({
            hex: c.hex,
            count: c.count,
            brightness: Math.round(c.brightness)
        }))
    );

    // The most common color is usually the background
    const backgroundColor = sortedColors[0];

    // Find text color: Look for a color with good contrast to background
    // and reasonable frequency (text usually takes less space than background)
    let textColor: ColorData | null = null;

    for (let i = 1; i < Math.min(sortedColors.length, 10); i++) {
        const candidate = sortedColors[i];

        // Skip colors too similar to background
        if (isSimilarColor(candidate, backgroundColor, 50)) continue;

        // Calculate contrast
        const contrast = calculateSimpleContrast(candidate, backgroundColor);

        // Good text color should have decent contrast (at least 2:1)
        if (contrast >= 2) {
            textColor = candidate;
            console.log(`✅ Selected text color: ${textColor.hex} (contrast: ${contrast.toFixed(2)}:1)`);
            break;
        }
    }

    // Fallback: if no good contrast found, pick most common color different from background
    if (!textColor) {
        // Try to find most contrasting color
        textColor = sortedColors.slice(1).reduce((best, current) => {
            if (isSimilarColor(current, backgroundColor, 50)) return best;
            const currentContrast = calculateSimpleContrast(current, backgroundColor);
            const bestContrast = best ? calculateSimpleContrast(best, backgroundColor) : 0;
            return currentContrast > bestContrast ? current : best;
        }, null as ColorData | null) || sortedColors[1] || sortedColors[0];

        // Ensure we explicitly handle the case where reduce returns null and sortedColors fallback works
        if (textColor) {
            console.log(`⚠️ Using fallback text color: ${textColor.hex}`);
        }
    }

    // Safety check if textColor is still somehow null (e.g. empty image/single color)
    if (!textColor) {
        textColor = backgroundColor;
    }

    // Get additional colors for variety
    const accentColors = sortedColors
        .filter(c => {
            // Added null check though logic above should ensure textColor/backgroundColor are set
            if (!backgroundColor || !textColor) return true;
            return !isSimilarColor(c, backgroundColor, 30) &&
                !isSimilarColor(c, textColor, 30);
        })
        .slice(0, 4);

    console.log(`📊 Final selection - Text: ${textColor.hex}, Background: ${backgroundColor.hex}`);

    return {
        textColor: textColor.hex,
        backgroundColor: backgroundColor.hex,
        allColors: sortedColors.slice(0, 6).map(c => ({
            hex: c.hex,
            count: c.count,
            brightness: c.brightness
        })),
        accentColors: accentColors.map(c => c.hex)
    };
}

/**
 * Calculate simple contrast ratio between two colors
 */
function calculateSimpleContrast(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }): number {
    const l1 = getRelativeLuminance(color1.r, color1.g, color1.b);
    const l2 = getRelativeLuminance(color2.r, color2.g, color2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance for contrast ratio
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const r2 = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g2 = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b2 = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
        .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase();
}

/**
 * Calculate brightness of RGB color
 */
function getBrightness(r: number, g: number, b: number): number {
    // Perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Check if two colors are similar
 */
function isSimilarColor(c1: { r: number, g: number, b: number }, c2: { r: number, g: number, b: number }, threshold = 30): boolean {
    const distance = Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
    return distance < threshold;
}

/**
 * Extract colors from image URL (for base64 or blob URLs)
 */
export async function extractColorsFromImageUrl(imageUrl: string): Promise<ExtractedColors> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Scale down for performance
            const maxSize = 200;
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            const colors = analyzePixels(pixels);
            resolve(colors);
        };

        img.onerror = reject;
        img.src = imageUrl;
    });
}
