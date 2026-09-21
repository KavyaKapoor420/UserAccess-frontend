/**
 * Contrast calculation utilities for WCAG 2.1
 */

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface WCAG2Rating {
    aa: {
        normal: boolean;
        large: boolean;
    };
    aaa: {
        normal: boolean;
        large: boolean;
    };
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Calculate relative luminance for WCAG 2.1
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        const sRGB = c / 255;
        return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG 2.1 contrast ratio
 */
export function calculateWCAG2Contrast(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get WCAG 2.1 rating
 */
export function getWCAG2Rating(contrast: number): WCAG2Rating {
    return {
        aa: {
            normal: contrast >= 4.5,
            large: contrast >= 3,
        },
        aaa: {
            normal: contrast >= 7,
            large: contrast >= 4.5,
        },
    };
}