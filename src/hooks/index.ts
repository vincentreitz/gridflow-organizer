// Export all custom hooks

// Export form hooks from react-hook-form if used
export { useController, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
// Re-export theme hook for convenience
export { useTheme } from "@/components/theme-provider";
export { useDialogHotkeys, useFormHotkeys, useHotkeys } from "./use-hotkeys";
export { useLocalStorage } from "./use-local-storage";
