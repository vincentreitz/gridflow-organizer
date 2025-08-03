import type { ClassValue } from "clsx";
import { cn } from "./utils";

/**
 * Design System Configuration
 * Centralized styling patterns for consistent component design
 */

// Animation Classes
export const animations = {
  fadeIn: "animate-in fade-in-0 duration-200",
  fadeOut: "animate-out fade-out-0 duration-200",
  slideInFromTop: "animate-in slide-in-from-top-2 duration-200",
  slideInFromBottom: "animate-in slide-in-from-bottom-2 duration-200",
  slideInFromLeft: "animate-in slide-in-from-left-2 duration-200",
  slideInFromRight: "animate-in slide-in-from-right-2 duration-200",
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200",
} as const;

// Shadow Classes
export const shadows = {
  sm: "shadow-sm",
  base: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  glow: "shadow-glow",
  card: "shadow-card",
  elevated: "shadow-elevated",
} as const;

// Border Radius Classes
export const radius = {
  none: "rounded-none",
  sm: "rounded-sm",
  base: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

// Spacing Classes
export const spacing = {
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
} as const;

// Focus Styles
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// Button Size Variants
export const buttonSizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-8 text-sm",
  xl: "h-12 px-10 text-base",
  icon: "h-9 w-9",
} as const;

// Input Size Variants
export const inputSizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-4 text-sm",
  xl: "h-12 px-4 text-base",
} as const;

// Gradient Classes
export const gradients = {
  primary: "bg-gradient-primary",
  surface: "bg-gradient-surface",
  card: "bg-gradient-card",
} as const;

// Typography Classes
export const typography = {
  display: "text-4xl font-bold tracking-tight",
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-2xl font-semibold tracking-tight",
  h3: "text-xl font-semibold tracking-tight",
  h4: "text-lg font-semibold tracking-tight",
  body: "text-sm",
  caption: "text-xs text-muted-foreground",
  muted: "text-sm text-muted-foreground",
} as const;

// State Classes
export const states = {
  disabled: "disabled:pointer-events-none disabled:opacity-50",
  loading: "animate-pulse",
  hover: "hover:bg-accent hover:text-accent-foreground",
  active: "active:scale-95",
} as const;

// Utility function to combine design system classes
export function createVariants<T extends Record<string, ClassValue>>(variants: T) {
  return (variant: keyof T, ...additionalClasses: ClassValue[]): string => {
    return cn(variants[variant], ...additionalClasses);
  };
}

// Common component patterns
export const patterns = {
  card: cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    "hover:shadow-md transition-shadow duration-200",
  ),
  cardHeader: "flex flex-col space-y-1.5 p-6",
  cardContent: "p-6 pt-0",
  cardFooter: "flex items-center p-6 pt-0",
  overlay: cn("fixed inset-0 z-50 bg-black/80", animations.fadeIn),
  dialog: cn(
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
    radius.lg,
    animations.scaleIn,
  ),
} as const;

// Color utility functions
export const colors = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  border: "hsl(var(--border))",
  ring: "hsl(var(--ring))",
} as const;

export default {
  animations,
  shadows,
  radius,
  spacing,
  focusRing,
  buttonSizes,
  inputSizes,
  gradients,
  typography,
  states,
  patterns,
  colors,
  createVariants,
};
